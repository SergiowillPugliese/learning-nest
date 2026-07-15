# Plan — Giorno 4: autenticazione JWT (versione compressa pre-colloquio)

**Data:** 2026-07-15
**Status:** completed (2026-07-15) — vedi [auth.md](../auth.md). Tutte le fasi chiuse tranne ownership (taglio dichiarato)
**Riferimento:** Giorno 4 del [piano di studio](../../../cross-cutting/2026-07-07-piano-studio-nestjs.md) — piano d'emergenza (colloquio 16/07)

## Obiettivo

Auth JWT funzionante e SPIEGABILE: register (bcrypt), login (token firmato), guard custom che protegge le rotte tasks. Budget: ~2 ore.

## Decisioni di taglio (dichiarate)

- **Un solo modulo `auth`** (niente modulo `users` separato): AuthService parla direttamente con PrismaService. A colloquio: "in un progetto più grande separerei l'anagrafica utenti dall'autenticazione"
- **Niente Passport**: guard custom con @nestjs/jwt, come da documentazione ufficiale corrente — più semplice da spiegare
- **Ownership task→user NON implementata** (si racconta: FK userId nello schema, filtro per utente nel service, user dal token via custom decorator)
- Un solo DTO credenziali per register e login (stessa forma)

## Fasi

1. Modello `User` nello schema Prisma (email @unique) + migration
2. Dipendenze: bcrypt (+types), @nestjs/jwt
3. Scaffold modulo auth con CLI + DTO credenziali
4. `register`: email duplicata → 409; hash bcrypt; mai ritornare la password
5. `login`: verify bcrypt + firma JWT (secret da .env, JWT_SECRET) → { access_token }
6. `AuthGuard` custom (CanActivate): Bearer token → verifyAsync → request.user; applicato a TasksController
7. Test completo da console browser: register → login → chiamata a /tasks con e senza token

## Rischi

- Tempo: se si sfora, il guard è l'ultima cosa sacrificabile (ma è anche la più preziosa per il parallelo Angular — provare a chiudere almeno register+login+guard senza fronzoli)
