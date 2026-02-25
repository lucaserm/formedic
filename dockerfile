FROM node:22-alpine3.22 AS build

RUN npm install -g bun@1.3.1

RUN apk add --no-cache bash
CMD ["/bin/bash"]

WORKDIR /app

COPY package.json  bun.lock ./

RUN bun i --frozen-lockfile

COPY . .

FROM build AS test

COPY --from=build /app .

ENTRYPOINT bun test

FROM build AS production

COPY --from=build /app .

ENTRYPOINT bun start
