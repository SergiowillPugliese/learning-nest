# Indice documentazione — learning-nest

> Mappa di tutti i doc del progetto. Da leggere SEMPRE a inizio sessione, insieme al piano di studio.

**Scopo del progetto:** percorso di apprendimento NestJS 11 per colloquio (~11–14 luglio 2026). Progetto guida: **TaskFlow**, REST API di task management. Regole in `CLAUDE.md` alla root.

## Cross-cutting (formazione e metodologia)

| Doc | Descrizione | Stato |
|-----|-------------|-------|
| [Piano di studio NestJS](cross-cutting/2026-07-07-piano-studio-nestjs.md) | Roadmap 6 giorni: fondamentali → REST/validazione → Prisma → Auth JWT → lifecycle/testing → simulazione colloquio | 🔄 in corso — Giorno 1 non iniziato |
| [Glossario backend](cross-cutting/glossario-backend.md) | Termini backend spiegati man mano, con paralleli Angular | 🔄 vivo, si aggiorna sempre |
| [Talking points colloquio](cross-cutting/2026-07-16-talking-points-colloquio.md) | Ionic (pronto) + storie Angular e racconto TaskFlow (da completare gio 16) | 🔄 in corso |

## ADR (decisioni architetturali)

| ADR | Decisione |
|-----|-----------|
| [001](adr/001-prisma-come-orm.md) | Prisma come ORM, SQLite in sviluppo |

## Features (TaskFlow)

| Feature | Giorni | Stato | Plan |
|---------|--------|-------|------|
| [`tasks`](features/tasks/tasks.md) — CRUD task su SQLite via Prisma | 1–3 | ✅ Giorni 1-3 completati (CRUD validato e persistente) | [2026-07-07 CRUD in memoria](features/tasks/plans/2026-07-07-giorno-1-crud-in-memoria.md) ✅ · [2026-07-13 validazione DTO](features/tasks/plans/2026-07-13-giorno-2-validazione-dto.md) ✅ · [2026-07-13 Prisma](features/tasks/plans/2026-07-13-giorno-3-prisma.md) ✅ |
| [`auth`](features/auth/auth.md) — register/login JWT, guard (assorbe anche users) | 4 | ✅ completata 15/07 (ownership solo raccontata) | [2026-07-15 auth JWT](features/auth/plans/2026-07-15-giorno-4-auth-jwt.md) ✅ |
| `common` — interceptor, config, decorator condivisi | 5 | ⬜ da iniziare | — |

> Quando una feature parte: creare `docs/features/<feature>/plans/YYYY-MM-DD-nome.md` PRIMA del codice, e `docs/features/<feature>/<feature>.md` (con sezione "Domande da colloquio") a fine implementazione.
