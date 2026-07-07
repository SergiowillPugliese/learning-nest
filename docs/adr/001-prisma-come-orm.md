# ADR 001 — Prisma come ORM (con SQLite in sviluppo)

**Data:** 2026-07-07
**Status:** accettato

## Contesto

TaskFlow (progetto di apprendimento NestJS per colloquio) ha bisogno di un database reale dal giorno 3 del piano di studio. Le opzioni principali nell'ecosistema Nest sono TypeORM (il default storico della documentazione) e Prisma (l'ORM più adottato nei progetti Node moderni).

Vincoli: Sergio è principiante assoluto sul backend, ha 4–7 giorni, lavora su Windows senza Docker garantito.

## Decisione

**Prisma + SQLite.**

- **Prisma** perché: schema dichiarativo in un unico file leggibile (`schema.prisma`), client generato completamente tipizzato (errori a compile time, familiare per chi viene da TypeScript/Angular), migration semplici, ed è oggi la scelta più citata negli annunci di lavoro Node/Nest.
- **SQLite** perché: zero setup (un file locale, niente server né Docker), e il provider si cambia in una riga di `schema.prisma` — il codice applicativo non cambia.

## Alternative considerate

- **TypeORM**: più "storico" in Nest, pattern Repository/Entity con decoratori (più simile allo stile Nest). Scartato perché ha più concetti da imparare subito (entity, repository injection, `forFeature`) e una DX più fragile per un principiante. Se al colloquio chiedono TypeORM, i concetti (entity, migration, repository) si trasferiscono — il glossario li copre.
- **Postgres in Docker**: più realistico per produzione, ma il setup ruba tempo al vero obiettivo (imparare Nest, non amministrare DB).
- **Nessun DB (array in memoria)**: usato solo nei giorni 1–2 come tappa didattica, poi migrato.

## Conseguenze

- Il pattern è "PrismaService iniettato nei service", non il Repository pattern di TypeORM: a colloquio va detto esplicitamente ("ho usato Prisma; con TypeORM il concetto equivalente è il repository").
- SQLite non supporta alcune feature Postgres (enum nativi, ecc.) — irrilevante per lo scope del progetto.
