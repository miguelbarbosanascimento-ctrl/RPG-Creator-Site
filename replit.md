# Feiticeiros & Maldições — Criador de Fichas de RPG

Um site para criar e gerenciar fichas de personagem para o sistema de RPG "Feiticeiros e Maldições", adaptação de Jujutsu Kaisen para o RPG de mesa criado por Setsugiri.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/feiticeiros run dev` — run the frontend (port 19150)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, TanStack Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- DB schema: `lib/db/src/schema/` (characters.ts, techniques.ts, aptitudes.ts)
- API contract: `lib/api-spec/openapi.yaml`
- API routes: `artifacts/api-server/src/routes/`
- Frontend pages: `artifacts/feiticeiros/src/`
- Generated hooks: `lib/api-client-react/src/generated/`
- Generated Zod schemas: `lib/api-zod/src/generated/`

## Architecture decisions

- Contract-first: OpenAPI spec → codegen → typed hooks + Zod validators
- Characters store skills, equipment, aptitudes, and abilities as JSON strings (flexible for RPG extensibility)
- Technique library seeded from the Enciclopédia Amaldiçoada; custom techniques supported (shared catalog, not per-user)
- Summary endpoints compute stats via SQL aggregations, scoped per user
- HP/Energy auto-calculated from attributes on character creation if not provided
- Auth via Clerk: cookies flow through the shared proxy (same-origin). All character/shikigami/domain/summary routes require auth and filter by `user_id`. Technique and aptitude catalogs remain public.

## Product

- **Dashboard** — visão geral dos personagens criados, estatísticas (total, nível médio, etc.)
- **Criador de Fichas** — formulário completo para criar personagens com todos os campos do sistema
- **Visualizador de Ficha** — exibição completa da ficha RPG com atributos, barras de PV/PE, técnica, aptidões
- **Biblioteca de Técnicas** — navegação e busca das técnicas da Enciclopédia Amaldiçoada + custom
- **Catálogo de Aptidões** — referência de todas as aptidões amaldiçoadas do sistema

## User preferences

- Toda interface em português brasileiro
- Sem emojis
- Tema escuro atmosférico, inspirado em Jujutsu Kaisen

## Gotchas

- After each OpenAPI spec change, re-run codegen: `pnpm --filter @workspace/api-spec run codegen`
- `techniqueDescription` in DB maps to `technique_description` in API (snake_case ↔ camelCase mismatch — handled in route mapper)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
