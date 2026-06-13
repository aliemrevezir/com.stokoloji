# Next.js 15 (geliştirme modu). Alpine yeterli; native bağımlılık yok.
FROM node:22-alpine

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable

WORKDIR /repo

# 1) Önce manifest'ler → bağımlılık katmanı kaynak değişikliklerinde cache'lenir.
COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY packages/api-client/package.json packages/api-client/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN pnpm install --filter @stokoloji/web... --no-frozen-lockfile

# 2) Sonra kaynak (workspace paketleri ham TS olarak transpilePackages ile gelir).
COPY packages packages
COPY apps/web apps/web

WORKDIR /repo/apps/web

EXPOSE 3000

CMD ["pnpm", "dev"]
