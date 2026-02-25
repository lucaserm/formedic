import { faker } from "@faker-js/faker";

import type { Professional } from "@/schemas/professional/professional.schema";

export function makeProfessional(
  override?: Partial<Professional>,
): Professional {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    ...override,
  };
}
