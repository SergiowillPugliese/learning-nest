# Plan — Giorno 3: Prisma + SQLite per il modulo tasks

**Data:** 2026-07-13
**Status:** completed (2026-07-14) — vedi [tasks.md](../tasks.md). Imprevisti risolti degni di nota: generator Prisma 7 in ESM su progetto CJS (fix: `moduleFormat = "cjs"`); client fuori da `src/` rompeva la build (fix: output in `src/generated`); Prisma 7 richiede driver adapter esplicito a runtime (`@prisma/adapter-better-sqlite3` + dotenv in main.ts)
**Riferimento:** Giorno 3 del [piano di studio](../../../cross-cutting/2026-07-07-piano-studio-nestjs.md) · [ADR 001](../../../adr/001-prisma-come-orm.md)

## Obiettivo

Sostituire l'array in memoria del `TasksService` con SQLite via Prisma, mantenendo INVARIATA l'interfaccia pubblica del service (stessi 5 metodi, stessi comportamenti HTTP). I task devono sopravvivere al riavvio.

## Scope

1. Teoria: ORM, schema dichiarativo, migration (paragone: commit git per lo schema DB)
2. Setup: `prisma` (dev) + `@prisma/client`, `npx prisma init` con datasource sqlite
3. Modello `Task` in `schema.prisma` (id autoincrement, description opzionale `String?`, createdAt/updatedAt con default/updatedAt automatici) + prima migration
4. `PrismaService` (`onModuleInit` → `$connect`) in `src/prisma/`, modulo dedicato esportato
5. Refactor `TasksService`: metodi async che delegano a `prisma.task.*`; il 404 resta responsabilità nostra (findUnique → null → NotFoundException)
6. Verifica: CRUD completo + riavvio del server + i dati devono esserci ancora

## Decisioni

- I seed spariscono: il DB parte vuoto (eventuale seed Prisma è fuori scope)
- `nextId` va in pensione: `@id @default(autoincrement())` nello schema
- Il controller NON cambia (bel argomento da colloquio: la separazione controller/service ha pagato)

## Rischi / note

- Concetti nuovi in fila: ORM → schema/migration → lifecycle hook → async. Spezzare in 4 passi, uno alla volta
- Su Windows il client Prisma si genera in node_modules: se il watch mode fa i capricci durante `prisma generate`, riavviarlo
