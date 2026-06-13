# Strapi 5 (geliştirme modu). Debian slim → sharp/pg için güvenilir prebuilt binary.
FROM node:22-slim

ENV NODE_ENV=development
ENV STRAPI_TELEMETRY_DISABLED=true

RUN corepack enable

WORKDIR /repo

# 1) Önce manifest'ler → bağımlılık katmanı kaynak değişikliklerinde cache'lenir.
COPY package.json pnpm-workspace.yaml ./
COPY apps/cms/package.json apps/cms/package.json

RUN pnpm install --filter @stokoloji/cms... --no-frozen-lockfile

# 2) Sonra kaynak.
COPY apps/cms apps/cms

WORKDIR /repo/apps/cms

EXPOSE 1337

# develop modu: admin panel + content-type builder açık, autoReload aktif.
CMD ["pnpm", "develop"]
