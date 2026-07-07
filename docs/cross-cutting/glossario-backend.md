# Glossario backend — termini spiegati man mano

> Regola: ogni termine backend nuovo va aggiunto qui la prima volta che compare in una sessione. Ordine alfabetico. Definizioni brevi, con parallelo frontend dove possibile.

**API (Application Programming Interface)** — il "contratto" con cui due programmi si parlano. Nel nostro caso: gli URL che il backend espone e che un frontend (come le tue app Angular) chiama con HttpClient.

**Endpoint** — un singolo URL + metodo HTTP esposto dall'API (es. `GET /tasks`, `POST /auth/login`). Ogni metodo decorato in un controller Nest è un endpoint.

**REST (REpresentational State Transfer)** — convenzione per disegnare API: le risorse sono sostantivi negli URL (`/tasks`), le azioni sono i metodi HTTP (GET legge, POST crea, PATCH aggiorna, DELETE elimina).

**Payload** — i dati trasportati da una richiesta o risposta HTTP; tipicamente il body JSON. Quando in Angular fai `http.post('/tasks', dati)`, `dati` è il payload.

**DTO (Data Transfer Object)** — una classe che descrive la forma dei dati che entrano o escono da un endpoint. Serve a validare e a non esporre mai la struttura interna del DB. *(approfondito al Giorno 2)*

**Entity** — la classe/modello che rappresenta una riga di una tabella del database. Diversa dal DTO: l'entity è com'è fatto il dato "dentro", il DTO è com'è fatto "alla frontiera". *(approfondito al Giorno 3)*

**ORM (Object-Relational Mapping)** — libreria che ti fa parlare col database usando oggetti e metodi (`prisma.task.findMany()`) invece di SQL scritto a mano. *(approfondito al Giorno 3)*

**Migration** — file versionato che descrive una modifica allo schema del database (crea tabella, aggiungi colonna...). Come i commit git, ma per la struttura del DB. *(approfondito al Giorno 3)*

**Middleware** — funzione che intercetta la richiesta PRIMA che arrivi al routing di Nest (logging, CORS...). Concetto ereditato da Express. *(approfondito al Giorno 5)*

**CRUD (Create, Read, Update, Delete)** — le 4 operazioni base su una risorsa. In REST mappano su POST (create), GET (read), PATCH/PUT (update), DELETE (delete). "Generare i CRUD entry points" = generare un endpoint per ciascuna di queste operazioni.

**DI / IoC (Dependency Injection / Inversion of Control)** — la conosci già da Angular: non crei tu le dipendenze con `new`, le dichiari nel costruttore e il framework te le fornisce. L'"IoC container" è il registro interno che sa costruire e consegnare ogni provider. *(approfondito al Giorno 1)*

**Repository (pattern)** — strato che incapsula l'accesso ai dati dietro un'interfaccia (findAll, findById, create...). TypeORM lo usa esplicitamente; con Prisma il ruolo lo svolge il service che usa PrismaService.

**JWT (JSON Web Token)** — token firmato che il server rilascia al login e il client rimanda a ogni richiesta per dimostrare chi è. Lato Angular lo hai già incontrato negli interceptor che aggiungono l'header `Authorization`. *(approfondito al Giorno 4)*
