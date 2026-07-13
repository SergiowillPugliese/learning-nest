# Feature: tasks (stato Giorno 2 — CRUD validato, in memoria)

**Ultimo aggiornamento:** 2026-07-13
**Stato:** CRUD in memoria con validazione completa dell'input. Prossime evoluzioni: Prisma (Giorno 3), ownership utente (Giorno 4).

## Panoramica

Modulo `tasks`: CRUD completo su risorsa Task, storage in array in memoria dentro il service (singleton). Generato con `nest g resource tasks`, implementato a mano da Sergio.

## Endpoints

| Metodo | URL | Fa | Risponde |
|---|---|---|---|
| POST | /tasks | crea (id generato dal server, default `completed: false`) | il task creato |
| GET | /tasks | lista tutti | array di task (copia difensiva) |
| GET | /tasks/:id | uno per id | il task, o **404** |
| PATCH | /tasks/:id | update parziale + `updatedAt` | il task aggiornato, o **404** |
| DELETE | /tasks/:id | elimina | il task eliminato, o **404** |

## Struttura

- `tasks.module.ts` — registra controller e provider (parallelo NgModule)
- `tasks.controller.ts` — solo routing e delega (controller magro), `+id` per convertire il param stringa
- `tasks.service.ts` — logica e storage: array privato + `nextId`
- `entities/task.entity.ts` — forma interna del Task (id, title, description, completed, createdAt, updatedAt)
- `dto/create-task.dto.ts` — cosa può mandare il client (title, description); `update-task.dto.ts` = `PartialType(CreateTaskDto)`

## Decisioni prese (e perché)

1. **Stile immutabile ovunque**: mai `push`/`splice`; sempre spread/`map`/`filter` + riassegnazione di `this.tasks`. Coerenza + nessuna mutazione a sorpresa per chi tiene riferimenti all'array.
2. **`nextId` contatore monotono** (parte da 5, dopo i seed): `length + 1` genera id duplicati dopo una DELETE. In produzione: autoincrement del DB o UUID.
3. **404 centralizzato**: `findOne` lancia `NotFoundException`; `update` e `remove` la riusano → la logica "non esiste" vive in un punto solo, comportamento uniforme.
4. **Si ritorna la risorsa, mai messaggi di successo**: lo status code comunica l'esito; il body porta i dati che il client non ha. I testi per l'utente sono responsabilità del frontend (i18n).
5. **Spread del DTO PRIMA dei campi server** nella create: i campi generati dal server (id, date, completed) sovrascrivono eventuali tentativi del client di forzarli.

## Validazione input (Giorno 2)

- **`ValidationPipe` globale** in `main.ts` (`app.useGlobalPipes`) con `whitelist: true` + `forbidNonWhitelisted: true`: campi non dichiarati nel DTO → 400 con elenco violazioni nel campo `message` (array)
- **`CreateTaskDto`**: `title` `@IsString() @IsNotEmpty()`, `description` `@IsString() @IsOptional()`
- **`UpdateTaskDto`**: `PartialType(CreateTaskDto)` (eredita campi E validatori, tutti opzionali) **esteso** con `completed?: boolean` (`@IsBoolean() @IsOptional()`) — il client può completare un task in update, ma non crearlo già completo (default del server)
- **`ParseIntPipe`** su ogni `@Param('id')`: il param arriva già `number`; `GET /tasks/abc` → 400 onesto invece del 404 fuorviante del vecchio `+id`
- Scoperta chiave (verificata con esperimento): senza pipe, i tipi TS non filtrano nulla a runtime — un body con campi inventati veniva salvato nel task. E la whitelist considera "ammessi" solo i campi CON almeno un decoratore di validazione: DTO nudo = tutto respinto.

## Limiti noti (voluti, si risolvono nei giorni successivi)

- Dati persi a ogni riavvio: storage in memoria (→ Giorno 3, Prisma)
- Niente utenti/permessi (→ Giorno 4)

## Domande da colloquio (Giorno 1) — con le risposte

**1. Cos'è un modulo in NestJS?**
L'unità di organizzazione del codice: raggruppa controller e provider di una feature e dichiara cosa importa da altri moduli. Nest costruisce l'applicazione come un grafo di moduli a partire da `AppModule`. È l'equivalente concettuale degli NgModule di Angular.

**2. Che differenza c'è tra controller e provider/service?**
Il controller gestisce il livello HTTP: riceve la richiesta (routing via decoratori), estrae i dati (`@Param`, `@Body`) e delega. Il service contiene la logica di business e non sa nulla di HTTP. Vantaggi: logica riusabile e testabile senza simulare richieste.

**3. Come funziona la dependency injection in Nest?**
Dichiaro la dipendenza nel costruttore tipizzandola; a runtime l'IoC container legge i metadati emessi da TypeScript (`emitDecoratorMetadata` + `reflect-metadata`), trova il provider registrato nel modulo e inietta l'istanza — di default **singleton**. `@Injectable()` marca la classe perché i metadati vengano generati.

**4. Cosa succede quando arriva `GET /tasks/3`?**
All'avvio Nest ha costruito la routing table leggendo i decoratori. La richiesta viene instradata a `TasksController.findOne`, `@Param('id')` estrae `"3"` **come stringa** (i route param sono sempre stringhe), `+id` la converte, il service cerca il task: lo ritorna, oppure lancia `NotFoundException` che l'exception layer di Nest traduce in una risposta 404 JSON.

**5. Perché un service può fare da storage in memoria?**
Perché è singleton: un'unica istanza vive per tutta la vita del processo e tutte le richieste passano da lei. Limite: i dati muoiono al riavvio e non scalano su più istanze — per questo esiste il database.

**6. Il tuo service ritorna la lista intera dopo una DELETE? / Cosa ritorni dalle mutazioni?**
La risorsa toccata (creata/aggiornata/eliminata), mai messaggi tipo "deleted successfully": l'esito lo comunica lo status code, il body serve per i dati. DELETE può anche rispondere 204 senza body.

## Domande da colloquio (Giorno 2) — con le risposte

**1. Come validi l'input in NestJS?**
Con DTO decorati da class-validator (`@IsString()`, `@IsNotEmpty()`, `@IsOptional()`…) e il `ValidationPipe` registrato globalmente in `main.ts`. La pipe usa class-transformer per trasformare il JSON in un'istanza della classe DTO e class-validator per applicare le regole; se qualcosa viola le regole, il client riceve 400 con l'elenco degli errori.

**2. Perché i tipi TypeScript non bastano a validare?**
Perché esistono solo a compile time: a runtime sono cancellati, e `@Body() dto: MyDto` è solo `req.body` non controllato. Ai confini dell'applicazione (input esterno) serve un controllo a runtime.

**3. Cosa fanno `whitelist` e `forbidNonWhitelisted`?**
`whitelist: true` elimina silenziosamente i campi del body che non hanno decoratori di validazione nel DTO; `forbidNonWhitelisted: true` invece li fa diventare un errore 400. Insieme impediscono il mass assignment di campi non previsti (es. un client che si auto-imposta `role: admin`).

**4. Cosa sono le pipe in Nest? Sono come quelle di Angular?**
No — falso amico. In Nest una pipe intercetta l'INPUT di un handler per trasformarlo o validarlo (`ParseIntPipe`, `ValidationPipe`); in Angular le pipe formattano l'OUTPUT nei template. Si applicano globalmente (`useGlobalPipes`), sul singolo parametro (`@Param('id', ParseIntPipe)`) o su handler/controller.

**5. Che differenza c'è tra DTO ed entity?**
Il DTO descrive la forma dei dati alla frontiera (cosa può mandare il client), l'entity la forma interna completa. Possono divergere: `completed` esiste nell'entity, è vietato in create (default del server) e permesso in update. Esperienza diretta: rendere `description` opzionale nel DTO ma non nell'entity fa esplodere il compilatore — le due forme vanno tenute coerenti consapevolmente.

**6. Perché `@IsRequired()` non esiste in class-validator?**
Perché ogni proprietà decorata è obbligatoria di default; l'opzionalità è opt-in con `@IsOptional()`. `@IsNotEmpty()` è un'altra cosa: controlla che il valore non sia vuoto (`""`), non che il campo sia presente.

## Micro-esercizio di verifica (da fare in autonomia)

Aggiungi un endpoint `GET /tasks/completed/count` che ritorna quanti task sono completati. Attenzione all'ordine delle rotte: cosa succede se Nest matcha prima `GET /tasks/:id`?

**Esercizio Giorno 2:** aggiungi al task un campo opzionale `priority` che accetti solo `'low' | 'medium' | 'high'` — ti servirà il decoratore `@IsIn([...])` (o `@IsEnum`). Il client deve poterla impostare sia in create che in update: dove la dichiari?
