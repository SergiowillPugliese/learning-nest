# TaskFlow — REST API di task management in NestJS

API costruita come percorso di apprendimento NestJS: CRUD di task con validazione, persistenza su SQLite via Prisma e autenticazione JWT completa (register, login, guard custom).

## Stack

| Cosa | Scelta |
|---|---|
| Framework | NestJS 11 |
| ORM / DB | Prisma 7 + SQLite (driver adapter better-sqlite3) |
| Validazione | class-validator + class-transformer (ValidationPipe globale con whitelist) |
| Auth | @nestjs/jwt + bcrypt, guard custom senza Passport |

## Setup da zero (dopo il clone)

```bash
npm install

# 1. Configurazione: copia il template e valorizza le variabili
#    (il file .env non è versionato)
copy .env.example .env      # macOS/Linux: cp .env.example .env

# 2. Database: le migration versionate ricreano lo schema da zero
npx prisma migrate dev

# 3. Client Prisma: genera i tipi dal tuo schema
npx prisma generate

# 4. Avvio in watch mode
npm run start:dev
```

Il database (`dev.db`) e il client generato (`src/generated`) **non sono versionati**: si ricostruiscono con i comandi sopra. Ciò che è versionato è la loro *ricetta*: `prisma/schema.prisma` e la cartella `prisma/migrations`.

## Endpoints

| Metodo | URL | Note |
|---|---|---|
| POST | /auth/register | 201 · 409 su email duplicata |
| POST | /auth/login | 200 `{ access_token }` · 401 |
| GET/POST | /tasks | protetti: `Authorization: Bearer <token>` |
| GET/PATCH/DELETE | /tasks/:id | protetti · 404 su id inesistente · 400 su id non numerico |

Script pronti per provare tutto dalla console del browser: [`demo-scripts.txt`](./demo-scripts.txt).

## Struttura

```
src/
├── auth/        # register, login, AuthGuard, DTO credenziali
├── tasks/       # controller + service CRUD, DTO validati
├── prisma/      # PrismaService (connessione via lifecycle hook) + modulo esportato
└── generated/   # client Prisma generato (non versionato)
docs/            # documentazione di progetto: feature doc, ADR, piani
prisma/          # schema + migration versionate
```

## Comandi

```bash
npm run start:dev    # watch mode
npm run test         # unit test
npm run test:e2e     # e2e
npm run lint         # eslint --fix
```
