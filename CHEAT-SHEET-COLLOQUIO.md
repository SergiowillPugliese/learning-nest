# CHEAT-SHEET COLLOQUIO — Lilitech, oggi ore 17

> Leggila una volta con calma, poi rileggila nei 10 minuti prima di entrare. Non memorizzare: RICONOSCI. Le cose le sai, le hai scritte tu.

---

## ⚡ LE 3 COSE DA BLINDARE OGGI (emerse dalla simulazione)

**A) CODICI DI STATO — la priorità n.1, l'errore più penalizzante e più facile da ribaltare.**
Imparali con l'esempio del task di un altro utente:
- **400** Bad Request = payload malformato / campo non previsto (è quello che dà il ValidationPipe con whitelist)
- **401** Unauthorized = "non so chi sei" → token mancante, scaduto o invalido
- **403** Forbidden = "so chi sei, ma non puoi" → utente A prova a modificare un task dell'utente B: token valido, ownership no
- **404** Not Found = la risorsa non esiste
- **409** Conflict = conflitto con lo stato attuale (es. email già registrata in fase di register)
> ⚠️ Il campo extra nel body è **400**, NON 403. Questo era l'errore grave: non ripeterlo.

**B) LIFECYCLE — l'ordine esatto (l'interceptor viene PRIMA della pipe):**
Middleware → Guard → **Interceptor (pre)** → **Pipe** → Controller → Interceptor (post) → Exception Filter.
Logica: chi sei (guard) → poi si apre il giro degli interceptor → poi si validano gli argomenti (pipe) subito prima del controller.

**C) RxJS mapping — la frase chiave (cosa fanno con la sovrapposizione):**
- **switchMap** = ANNULLA il precedente quando arriva un nuovo valore (search-as-you-type; evita race condition)
- **mergeMap** = li esegue TUTTI in parallelo, nessun annullamento (N chiamate indipendenti)
- **exhaustMap** = IGNORA i nuovi finché il corrente non finisce (bottone login/save premuto più volte)
> Regola: conta solo l'ultimo → switchMap · solo il primo → exhaustMap · tutte → mergeMap.
> ⚠️ mergeMap NON è "unire i risultati" (quello è forkJoin).

**+ Due mosse comportamentali (dal debrief):**
1. Quando ti correggono, **rilancia**: "ah giusto, quindi nel mio caso avrei dovuto…" — mostra che integri in tempo reale
2. Ogni "non lo conosco" accompagnalo con il piano: "…non l'ho ancora usato, so a grandi linee che è X, ed è tra le prime cose che approfondirei qui"

**Bonus — SQL vs NoSQL, la ragione GIUSTA** (non "più veloce da leggere"):
SQL = schema rigido + relazioni/join, forte su dati strutturati e coerenza. NoSQL documenti (Mongo) = schema flessibile, dati annidati letti in un colpo, scala meglio in orizzontale. Si sceglie in base alla forma dei dati e al tipo di accesso, non alla "velocità".

---

## 1. Il pitch di apertura (quando dicono "parlaci di te")
Sviluppatore frontend Angular con esperienza reale (e-commerce/backoffice, anche Angular legacy). Quando ho visto questa posizione full-stack, invece di dire "il backend non lo so" ho passato una settimana a costruire una vera REST API in NestJS da zero — così posso parlarne con cognizione. Sono qui perché voglio crescere full-stack e questo stack è esattamente la direzione che voglio prendere.

## 2. La storia di TaskFlow (il tuo asso — raccontala tu, spontaneo)
"Ho costruito TaskFlow, un'API di task management in NestJS. Ha:
- CRUD completo con validazione dell'input (class-validator)
- database SQLite via Prisma, con migration versionate
- autenticazione JWT completa: registrazione con password hashata, login, e un guard che protegge le rotte
Posso spiegare ogni riga e ogni bug che ho risolto. È sul mio GitHub."

**Le storie dei bug valgono più dei successi** (raccontane una se puoi):
- l'update che rispondeva "ok" ma non salvava → capito l'immutabilità e le reference
- un campo inventato finiva nel DB finché non ho attivato la whitelist → i tipi TypeScript non validano a runtime
- scontro tra i due sistemi di moduli di Node (CommonJS/ESM) col client Prisma

---

## 3. RISPOSTE-LAMPO (se chiedono X → dici Y)

**Cos'è la dependency injection / come fa Nest a iniettare?**
Non creo io le classi con `new`: le dichiaro nel costruttore e Nest me le fornisce. Legge i tipi del costruttore (via reflect-metadata, grazie a @Injectable) e cerca il provider nel modulo. Istanza singleton condivisa.

**Controller vs Service?**
Controller = riceve la richiesta HTTP e delega. Service = la logica. Controller magro, service grasso: così la logica è riusabile e testabile.

**Come validi l'input?**
DTO con decoratori class-validator + ValidationPipe globale. `whitelist` toglie i campi non previsti, `forbidNonWhitelisted` li rifiuta con 400. I tipi TS spariscono a runtime, quindi la validazione vera serve.

**DTO vs Entity?**
DTO = forma dei dati alla frontiera (cosa il client può mandare). Entity = forma interna. Divergono per scelta: es. `completed` non si manda in creazione (default del server) ma sì in update.

**Cos'è un ORM / una migration?**
ORM = parli col DB con oggetti tipizzati invece di SQL a mano (io: Prisma). Migration = file versionato che descrive una modifica allo schema. È "il commit git del database": ricostruibile su ogni ambiente.

**Il request lifecycle (LA domanda):**
Ordine: middleware → guard → interceptor → pipe → handler (controller) → interceptor → e sotto tutto l'exception filter per gli errori.
La logica: prima CHI sei (guard), poi COSA porti (pipe/validazione), poi il lavoro. Se qualcosa lancia un'eccezione, il filter la trasforma nella risposta HTTP giusta.
Metafora se serve a me: strada → buttafuori → fotografo → metal detector → pista → fotografo, + rete di sicurezza.

**Flusso di autenticazione JWT:**
Register: salvo la password hashata con bcrypt (mai in chiaro). Login: ri-hasho e confronto; se ok firmo un token col secret del server. Poi il client manda `Authorization: Bearer <token>`, il guard verifica la firma. Stateless: nessuna sessione server.

**bcrypt: perché non cifratura?**
La cifratura è reversibile, l'hash no. bcrypt è lento apposta (anti-forza-bruta) e usa il salt (due password uguali → hash diversi).

**Il JWT è cifrato?** No, è FIRMATO. Il contenuto è leggibile (base64, si vede su jwt.io), ma non falsificabile senza il secret.

**Codici di stato?** → vedi il blocco ⚡A in cima (400/401/403/404/409 con l'esempio del task di un altro utente). È la domanda su cui puoi ribaltare tutto: spaccala.

**Guard di Nest vs di Angular?** Stesso concetto (CanActivate), scopo diverso: Angular = UX (aggirabile da devtools), Nest = sicurezza vera server-side.

---

## 4. I PONTI per ciò che (ancora) non so — onesto + ragionamento

**MongoDB / NoSQL** (loro lo usano!): "Ho lavorato con Prisma su SQL, ma Prisma supporta anche MongoDB e i concetti — schema, client tipizzato, REST — si trasferiscono. So la differenza di fondo: SQL = tabelle con schema rigido e relazioni; NoSQL documenti = più flessibile, dati annidati, si scala in orizzontale. Da approfondire con la pratica, ma la logica la seguo."

**Realtime / WebSocket** (loro lo usano!): "Da frontend il realtime l'ho consumato. Lato Nest so che ci sono i gateway WebSocket come cittadini di prima classe — è una delle cose che mi piacerebbe imparare qui."

**IT ops (domini, SSL, VPS, AWS):** onesto e sereno → "Non l'ho gestito in prima persona. So cosa sono e mi interessa impararlo, ma non fingo esperienza che non ho."

---

## 5. IONIC (esperimento personale con Capacitor)
"Ci ho lavorato poco, ma tre cose le ho toccate con mano — e in fondo è Angular:"
1. Le pagine si impilano invece di distruggersi (navigazione nativa mobile)
2. Ci sono lifecycle hook extra (ionViewWillEnter…) proprio perché la pagina resta viva
3. Stesso HTML, look diverso iOS/Android: lo fa Ionic in automatico (mode md/ios)
"Capacitor l'ho usato come bridge nativo, ma solo in browser, mai deployato su device."

---

## 6. QUANDO NON SO UNA RISPOSTA (regola d'oro)
NON bluffare mai. Formula: **"Non lo so"** + **provo a ragionarci** ("però immagino funzioni così perché in Angular…") + **"lo verificherei così"**. Chi assume un profilo in crescita valuta più questo che dieci nozioni recitate.

Ragiona SEMPRE ad alta voce: "prima verifico di aver capito… parto dalla soluzione semplice… poi la miglioro". Stanno guardando COME pensi.

---

## 7. DOMANDE DA FARE A LORO (quando chiedono "hai domande?")
- L'app di controllo della domotica è in Ionic? Come gestite il realtime verso i dispositivi (WebSocket, MQTT)?
- Per il database distribuito, come vi siete divisi tra MongoDB e Cassandra?
- Come è strutturato il team e come lavorereste con me all'inizio, dato che sul backend parto in crescita?
- Che percorso di crescita immaginate per questa posizione?

---

## 📚 APPROFONDIMENTI FRONTEND + ARCHITETTURA

**concatMap** — come switchMap/mergeMap, ma mette gli inner observable **in CODA**: finisce il primo, poi parte il secondo, in ordine garantito. Uso: quando l'ordine conta e le operazioni non devono sovrapporsi (es. una sequenza di salvataggi che devono andare uno dopo l'altro). → Completa la regola: ultimo=switchMap, primo=exhaustMap, tutte-in-parallelo=mergeMap, **tutte-in-ordine=concatMap**.

**tap** — operatore per **side effect**: NON modifica il flusso, lo lascia passare intatto. Serve per loggare, settare un flag di loading, debug. "tap = sbircio quello che passa senza toccarlo".

**signal — cos'è e i metodi:**
- `const x = signal(0)` crea un signal scrivibile; lo LEGGI chiamandolo: `x()`
- `.set(v)` → sostituisce il valore · `.update(prev => ...)` → nuovo valore dal precedente
- `computed(() => x() * 2)` → signal derivato, in sola lettura, si ricalcola da solo
- `effect(() => ...)` → esegue un side effect quando i signal letti dentro cambiano
- `.asReadonly()` → espone la versione in sola lettura (nel service tieni privato lo scrivibile)
- (`.mutate` NON esiste più, rimosso: si usa update con un nuovo riferimento)

**Signal vs Observable (differenza + vantaggi):**
- **Signal**: sincrono, ha SEMPRE un valore corrente, lo "tiri" tu leggendolo (pull). Niente subscribe, niente unsubscribe → niente memory leak. Reattività granulare: leggere un signal nel template crea la dipendenza → aggiornamento fine, verso lo zoneless. Ideale per lo **stato**.
- **Observable**: asincrono, valori nel tempo (push), ricco di operatori (debounce, retry, combinazioni), ma va sottoscritto e ripulito. Ideale per **eventi/flussi**: HTTP, websocket, input utente.
- Frase: "Signal per lo stato sincrono, Observable per i flussi asincroni; si parlano con `toSignal()` e `toObservable()`."

**Reactive Forms — FormControl vs FormBuilder:**
- `FormControl`/`FormGroup`/`FormArray` = i mattoni: un control ha valore + stato di validazione. Puoi costruire il form a mano con `new FormControl(...)`, `new FormGroup({...})`.
- `FormBuilder` = servizio iniettabile che è **zucchero sintattico** sopra quei mattoni: `fb.group({...})`, `fb.control()`, `fb.array()`. Stesso risultato, meno codice. "FormBuilder non fa nulla di diverso, riduce solo il boilerplate."

**resource() / rxResource() (Angular 19+):** API per caricare dati async esponendoli come **signal** (`.value()`, `.status()`, `.error()`). `resource` usa un loader con Promise, `rxResource` un loader che ritorna un Observable. Quando cambia il signal di richiesta, **annulla** la richiesta precedente (come switchMap). "È il modo signal-first di gestire l'async in un componente, senza subscribe manuale."

**Lazy loading:** caricare una parte dell'app **solo quando serve**, non nel bundle iniziale. Nel routing: `loadComponent: () => import('...')` (standalone) o `loadChildren`. Vantaggio: bundle iniziale più piccolo → primo caricamento più veloce. "Import dinamico a livello di rotta."

**Microfrontend + Module Federation:**
- **Perché**: spezzare un frontend grande in parti **deployabili in modo indipendente**, ognuna magari di un team diverso. Ogni pezzo si rilascia da solo, senza ribuildare tutto.
- **Module Federation** (Webpack 5 / Native Federation per il builder moderno Angular): un'app **host/shell** carica a **runtime** delle app **remote**, condividendo le dipendenze comuni (es. Angular caricato una volta sola). I remote "espongono" componenti/moduli, la shell li consuma.
- **Manifest**: file di config (JSON) che elenca i remote e i loro URL; la shell lo legge all'avvio per sapere DOVE scaricare ogni remote → puoi cambiare l'URL di un remote senza ribuildare la shell.
- **Hosting**: ogni remote è buildato e deployato per conto suo (URL/CDN propri) ed espone un `remoteEntry.js`; la shell lo carica a runtime tramite il manifest.
- Onestà: "Il concetto lo conosco; in produzione non l'ho ancora configurato io."

**Kafka** (nice-to-have loro): piattaforma di **event streaming** / message broker. I producer pubblicano eventi su **topic**, i consumer si iscrivono (pub/sub). Disaccoppia i servizi, gestisce alta portata di dati realtime, è un log **durevole e ri-leggibile**. "Non l'ho usato; a grandi linee è un broker a topic per event streaming, ed è tra le prime cose che approfondirei visto che è nel vostro stack realtime."

---

## 8. TESTA E LOGISTICA
- Parti alle 16:00. Porta: PC o telefono col repo GitHub aperto, `demo-scripts.txt` pronto.
- Sei un Angular solido che sta imparando il backend in fretta — NON un backendista che bluffa. Quella è la tua forza, non un limite.
- Loro sanno già il tuo profilo e ti hanno chiamato. La RAL (35-40k) conferma che cercano il tuo livello.
- Respira. Hai costruito una API completa in una settimana partendo da zero. È più di quanto chiedano.
```
IN BOCCA AL LUPO 🐺
```
