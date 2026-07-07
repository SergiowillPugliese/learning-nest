# Piano di studio NestJS — preparazione colloquio

**Creato:** 2026-07-07
**Status:** in corso
**Deadline:** colloquio intorno all'11–14 luglio 2026 (~4–7 giorni disponibili)
**Metodo:** progetto unico incrementale (**TaskFlow**, API di task management), un concetto alla volta

## Obiettivo

Non "far funzionare il codice" ma saper **spiegare** ogni concetto a voce, a un colloquio, senza AI. Ogni giornata chiude con: codice funzionante + spiegazione compresa + domande da colloquio con risposte.

## Perché TaskFlow

Un task manager con utenti e autenticazione copre TUTTI i temi scelti (fondamentali, REST+DB, auth JWT) in un unico progetto raccontabile a colloquio: "ho costruito un'API con Nest, ecco come ho gestito X". Molto più forte di dieci esempi scollegati.

---

## Giorno 1 — Architettura e fondamentali

**Cosa costruiamo:** modulo `tasks` con CRUD completo, dati in un array in memoria dentro il service.

**Concetti (in ordine):**
1. Come si avvia un'app Nest: `main.ts`, `NestFactory`, il concetto di bootstrap (parallelo: `bootstrapApplication` di Angular)
2. I tre mattoni: **Module** (organizza), **Controller** (riceve le richieste HTTP), **Provider/Service** (logica) — parallelo diretto con NgModule/Component/Service di Angular
3. **Dependency Injection**: cos'è, come funziona in Nest (constructor injection, `@Injectable()`, l'IoC container), differenze con la DI di Angular
4. Decoratori di routing: `@Controller()`, `@Get()`, `@Post()`, `@Param()`, `@Body()`
5. La CLI: `nest g resource tasks` e lettura guidata di ogni file generato

**Domande da colloquio attese:** cos'è un modulo e perché esiste; spiega la DI e i suoi vantaggi; differenza controller/service; cosa fa `@Injectable()`.

## Giorno 2 — REST robusto: DTO, validazione, errori

**Cosa costruiamo:** validazione completa su `tasks` (create/update), gestione errori corretta (404 su id inesistente, 400 su body invalido).

**Concetti:**
1. **DTO** (Data Transfer Object): cos'è, perché non si usa l'entity direttamente
2. `class-validator` + `class-transformer`: decoratori di validazione (`@IsString()`, `@IsOptional()`...)
3. **Pipe**: cosa sono nel request lifecycle, `ValidationPipe` globale, `ParseIntPipe` — e il falso amico con le pipe di Angular
4. **Exception handling**: `HttpException`, `NotFoundException`, come Nest trasforma le eccezioni in risposte HTTP (exception filter di default)
5. `PartialType` di `@nestjs/mapped-types` per l'update DTO

**Domande da colloquio attese:** a cosa serve un DTO; come validi l'input in Nest; cosa succede se un service lancia `NotFoundException`; whitelist/forbidNonWhitelisted.

## Giorno 3 — Database reale con Prisma

**Cosa costruiamo:** migrazione di `tasks` da array in memoria a SQLite via Prisma. Schema, prima migration, `PrismaService`.

**Concetti:**
1. Cos'è un **ORM** e cosa risolve; panorama Nest (TypeORM vs Prisma) — vedi ADR 001
2. `schema.prisma`: modelli, tipi, il concetto di **migration** (versionamento dello schema DB, come i commit per il database)
3. `PrismaService` come provider iniettabile (`onModuleInit`, lifecycle hooks di Nest)
4. Refactor del `TasksService`: stessa interfaccia pubblica, storage diverso — il valore della separazione controller/service
5. `async/await` lato server: perché QUI tutte le operazioni DB sono asincrone (parallelo con le Promise che già conosce da JS)

**Domande da colloquio attese:** cos'è una migration; perché un ORM; come integri Prisma in Nest; cosa sono i lifecycle hooks di un provider.

## Giorno 4 — Autenticazione: utenti, JWT, guard

**Cosa costruiamo:** modulo `users` + modulo `auth` con register/login, hashing password con bcrypt, JWT con `@nestjs/jwt`, `AuthGuard` custom che protegge le rotte dei task, ownership (ogni task appartiene a un utente).

**Concetti:**
1. Autenticazione vs autorizzazione
2. Perché le password si hashano (bcrypt, salt) e non si cifrano
3. Cos'è un **JWT**: struttura (header.payload.signature), stateless auth, dove il frontend lo mette (qui Sergio parte avvantaggiato: lato Angular lo ha già visto con gli interceptor)
4. **Guard**: `CanActivate`, parallelo quasi 1:1 con i route guard di Angular
5. Custom decorator `@CurrentUser()` per leggere l'utente dalla request
6. Relazione 1‑N nello schema Prisma (User → Task)

**Domande da colloquio attese:** come funziona un flusso di login JWT; differenza guard/middleware; dove salvi il secret (env, mai hardcoded); perché bcrypt.

## Giorno 5 — Request lifecycle completo + testing

**Cosa costruiamo:** un logging interceptor o middleware semplice, `ConfigModule` per il JWT secret, unit test di `TasksService` (Prisma mockato) e un e2e test con Supertest.

**Concetti:**
1. **Il request lifecycle completo** — LA domanda da colloquio Nest per eccellenza: middleware → guard → interceptor (pre) → pipe → handler → interceptor (post) → exception filter
2. Quando usare cosa: middleware vs guard vs interceptor vs pipe vs filter (tabella decisionale)
3. `@nestjs/config`: variabili d'ambiente, validazione della config all'avvio
4. Unit test di un service: `Test.createTestingModule`, mock dei provider (il parallelo con TestBed di Angular)
5. e2e: cosa testa in più rispetto allo unit

**Domande da colloquio attese:** descrivi il request lifecycle; differenza interceptor/middleware; come testi un service che dipende dal DB; unit vs e2e.

## Giorno 6 — Ripasso e simulazione colloquio

**Cosa facciamo:**
1. Cheat-sheet finale: un doc con tutti i concetti in una pagina
2. Simulazione colloquio: Claude fa domande a Sergio, Sergio risponde a voce/per iscritto, feedback sulle risposte
3. Ripasso mirato dei punti deboli emersi dalla simulazione
4. Ripasso del racconto del progetto: "descrivimi qualcosa che hai costruito" → risposta strutturata su TaskFlow

---

## Regole di avanzamento

- Non si passa al giorno successivo se il precedente non è compreso (la simulazione di fine giornata lo verifica: 3 domande, se ne sbagli 2 si ripassa)
- Se un giorno reale copre meno di un "giorno" del piano, va bene: meglio solidi che completi. In caso di tempo stretto, il giorno 5 è comprimibile (solo request lifecycle + un unit test), il giorno 6 no.
- Ogni giornata completata → feature doc in `docs/features/<feature>/` con la sezione "Domande da colloquio"

## Stato avanzamento

- [ ] Giorno 1 — Fondamentali + CRUD in memoria
- [ ] Giorno 2 — DTO, validazione, errori
- [ ] Giorno 3 — Prisma + SQLite
- [ ] Giorno 4 — Auth JWT + guard
- [ ] Giorno 5 — Request lifecycle + testing
- [ ] Giorno 6 — Ripasso e simulazione
