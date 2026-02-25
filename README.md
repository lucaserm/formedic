# Decisões Técnicas — Formedic API

## Visão Geral

Este documento descreve as decisões técnicas tomadas na construção da API de gerenciamento de agenda médica, cobrindo arquitetura, stack, diferenciais implementados e raciocínio por trás de cada escolha.

---

## Stack

| Tecnologia                  | Papel                                                    |
| --------------------------- | -------------------------------------------------------- |
| **Bun**                     | Runtime JavaScript/TypeScript de alta performance        |
| **Elysia**                  | Framework web otimizado para Bun, com tipagem end-to-end |
| **PostgreSQL**              | Banco de dados relacional principal                      |
| **Drizzle ORM**             | ORM type-safe com migrations automáticas                 |
| **Zod**                     | Validação de schemas em runtime                          |
| **Docker / Docker Compose** | Containerização da aplicação e do banco                  |

---

## Arquitetura — Clean Architecture

A organização do projeto segue os princípios da **Clean Architecture**, separando responsabilidades em camadas bem definidas:

```
HTTP (Routes) → Use Cases → Repositories → Database
                    ↓
               Services (Alertas/Logging)
                    ↓
               Error Handling
```

### Camadas

| Camada           | Pasta               | Responsabilidade                                        |
| ---------------- | ------------------- | ------------------------------------------------------- |
| **HTTP**         | `src/http/`         | Receber requisições, validar entrada, retornar resposta |
| **Use Cases**    | `src/use-cases/`    | Orquestrar regras de negócio                            |
| **Repositories** | `src/repositories/` | Abstrair o acesso a dados                               |
| **Database**     | `src/db/`           | Schema e conexão com o banco                            |
| **Services**     | `src/services/`     | Serviços auxiliares (logs, alertas)                     |
| **Errors**       | `src/errors/`       | Hierarquia de erros customizados                        |

### Por que Clean Architecture?

A escolha foi motivada pelos princípios **SOLID**:

- **S — Single Responsibility**: cada camada tem uma única razão para mudar. Uma rota não sabe nada de banco de dados; um use case não sabe nada de HTTP.
- **O — Open/Closed**: adicionar um novo banco de dados (ex: MySQL) exige apenas uma nova implementação de `SchedulesRepository`, sem alterar os use cases.
- **L — Liskov Substitution**: `DrizzleSchedulesRepository` e `InMemorySchedulesRepository` são intercambiáveis — ambos respeitam a mesma interface.
- **I — Interface Segregation**: cada repositório expõe apenas os métodos que fazem sentido para aquele recurso.
- **D — Dependency Inversion**: os use cases dependem de abstrações (interfaces), nunca de implementações concretas. As implementações são injetadas via factories.

```typescript
// Use case depende de abstração, não de implementação
class CreateScheduleUseCase {
  constructor(private repository: SchedulesRepository) {}
}

// Factory injeta a implementação concreta
export function makeCreateScheduleUseCase() {
  return new CreateScheduleUseCase(new DrizzleSchedulesRepository());
}
```

Essa separação garante que o core da aplicação — regras de negócio — nunca vaze para camadas externas, e que qualquer parte do sistema possa ser substituída isoladamente.

---

## Modelagem do Banco de Dados

```sql
patients       (id, name)
professionals  (id, name)
schedules      (id, patient_id, professional_id, date, time)
               UNIQUE(professional_id, date, time)
```

A constraint `UNIQUE(professional_id, date, time)` garante **no nível de banco** que não haverá conflito de horário para o mesmo profissional — funcionando como uma segunda linha de defesa além da validação no use case.

O campo `date` é armazenado como texto no formato `DD-MM-YYYY` e `time` como `HH:MM`, mantendo simplicidade e legibilidade sem overhead de conversão de timezone para o escopo do desafio.

---

## Validação com Zod

A validação de entrada é feita com **Zod** na camada HTTP, antes de qualquer processamento de negócio:

```typescript
body: z.object({
  patientId: z.string().uuid(),
  professionalId: z.string().uuid(),
  date: z.string().regex(/^\d{2}-\d{2}-\d{4}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
});
```

Além dos schemas de request/response, variáveis de ambiente também são validadas em `src/env.ts` — impedindo que a aplicação suba com configurações inválidas:

```typescript
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  // ...
});
```

---

## Tratamento de Erros

O tratamento de erros é centralizado no plugin `error-handler.ts`, que intercepta todas as exceções da aplicação. A hierarquia de erros customizados permite respostas HTTP semânticas:

```
AppError (base)
├── ConflictError       → 409 (conflito de horário)
├── InternalServerError → 500
└── TooManyRequestsError → 429
```

O handler diferencia erros **esperados** (instâncias de `AppError`) de erros **inesperados** (exceções genéricas). Erros 5xx são registrados via `AlertService`, permitindo integração futura com ferramentas de observabilidade (Sentry, Datadog, etc.) sem alterar o restante do código.

```typescript
if (error instanceof AppError) {
  // retorna mensagem controlada ao cliente
} else {
  alertService.warn("Unhandled error", { error });
  // retorna mensagem genérica, nunca expõe internals
}
```

---

## Diferenciais — O que foi além do pedido

O enunciado define como **opcionais** validação de dados e tratamento de erros. Além de implementar ambos, os seguintes extras foram adicionados:

### ✅ Testes Automatizados

Não havia qualquer menção a testes no enunciado. Ainda assim, foram escritos testes unitários com **Bun Test** para os use cases críticos:

- `CreateScheduleUseCase` — valida detecção de conflito e criação bem-sucedida
- `ListSchedulesUseCase` — valida filtragem por data e profissional

O `InMemorySchedulesRepository` foi criado exclusivamente para viabilizar esses testes sem dependência de banco de dados, seguindo o padrão de **Test Double** da Clean Architecture.

O `docker-compose.yml` executa os testes em container isolado como pré-condição para subir a aplicação:

```yaml
app:
  depends_on:
    tests:
      condition: service_completed_successfully
```

### ✅ Rate Limiting

Plugin de rate limit configurável via variáveis de ambiente (`RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS`), com identificação por IP, JWT ou user-agent.

### ✅ Métricas com Prometheus

Todas as requisições são instrumentadas com `prom-client`, expondo métricas de contagem por método, rota e status code. Endpoint `/metrics` disponível para coleta por Prometheus/Grafana.

### ✅ Documentação OpenAPI

Integração com `@elysiajs/openapi` gerando documentação interativa (Swagger UI) automaticamente a partir dos schemas Zod já definidos nas rotas. Disponível em `/swagger`.

### ✅ Seed de Dados

Script `scripts/seed.ts` com `@faker-js/faker` para popular o banco com pacientes e profissionais de teste, facilitando a avaliação manual da API.

### ✅ Docker Compose completo

O `docker-compose.yml` orquestra três serviços: `postgres`, `tests` e `app`, com healthchecks e dependências encadeadas — garantindo que o banco esteja pronto antes dos testes, e os testes passem antes da app subir.

---

## Uso de IA no Workflow

O GitHub Copilot foi utilizado como assistente durante o desenvolvimento, principalmente para:

- Geração de boilerplate repetitivo (schemas Zod, tipagens TypeScript)
- Sugestões de nomes e estrutura de pastas
- Revisão rápida de lógica em trechos pontuais

Todo o design arquitetural, decisões técnicas e implementação das regras de negócio foram realizados manualmente, com IA como acelerador — não como tomador de decisão.
