# Talking points per il colloquio Lilitech — 16/07/2026 ore 17:00

**Status:** Ionic pronto · Angular da compilare giovedì · TaskFlow si aggiorna a fine Giorno 4

Regola d'ingaggio unica: mai bluffare. Formula per ciò che non sai: "non lo so" + ragionamento ad alta voce + come lo scoprirei.

---

## Ionic — 5 minuti credibili (base: esperimento personale con Capacitor)

**Apertura onesta:** "L'ho esplorato con un progetto personale usando Capacitor — esperienza da laboratorio, non da produzione. Ma i tre concetti che lo distinguono da Angular puro li ho toccati con mano, e il resto È Angular."

### 1. Lo stack di navigazione (la "perplessità" che era un'intuizione)

Cosa hai visto: le pagine si sovrappongono senza distruggersi. Non è un difetto — è LA feature: Ionic replica la navigazione nativa mobile (le schermate si impilano, il back è istantaneo, lo stato della pagina sotto si conserva). Nel router Angular standard, di default il componente da cui esci viene distrutto; in Ionic resta vivo nello stack.

> Frase da colloquio: "Mi aveva colpito che il router di Ionic impila le pagine invece di distruggerle: è il modello di navigazione nativo mobile, e spiega anche perché esistono i lifecycle hook aggiuntivi."

### 2. I lifecycle hook di Ionic (conseguenza diretta del punto 1)

Se la pagina non viene distrutta, `ngOnInit` NON riscatta quando ci ritorni sopra (la pagina esiste già!). Per questo Ionic aggiunge `ionViewWillEnter` / `ionViewDidEnter` / `ionViewWillLeave` / `ionViewDidLeave`: scattano a OGNI ingresso/uscita. Regola pratica: setup one-time in `ngOnInit`, refresh dei dati in `ionViewWillEnter`.

> Frase da colloquio: "I due sistemi di hook convivono: quelli Angular seguono la vita del componente, quelli Ionic seguono la visibilità della pagina nello stack."

### 3. Lo styling adattivo iOS/Android (il dubbio sull'HTML, risolto)

Il dubbio era: "come lavoro l'HTML in modo diverso tra Android e iOS?" Risposta: **non si lavora in modo diverso** — è Ionic che lo fa per te. Ogni componente Ionic ha due render: `mode="md"` (Material, Android) e `mode="ios"`, scelti automaticamente in base alla piattaforma. Stesso HTML, look nativo per ciascun OS. La personalizzazione si fa con le CSS variables del theming; per eccezioni mirate esistono le classi `.ios`/`.md` e il servizio `Platform`.

> Frase da colloquio: "L'HTML non si biforca: si scrive una volta e il mode system di Ionic adatta il rendering alla piattaforma; il theming si governa con le CSS variables."

### 4. Capacitor (una frase, onesta)

"Ho usato Capacitor come bridge nativo — la webview + i plugin per le API di sistema. Non sono mai arrivato al deploy su device fisico: so che la pipeline passa da Android Studio/Xcode, ma l'ho provato solo in browser."

---

## Angular — 2-3 storie dal lavoro (da compilare giovedì)

Schema per ogni storia: contesto → problema → scelta tecnica (e alternative scartate) → risultato.

1. Feature resi (4Shop): flusso multi-step con stato condiviso, API che evolvevano in parallelo — DA DETTAGLIARE
2. — (seconda storia)
3. — (terza storia)

## TaskFlow — il racconto (si completa dopo il Giorno 4)

"Quando ho saputo della posizione ho costruito una REST API NestJS partendo da zero backend: CRUD validato (class-validator + ValidationPipe con whitelist), SQLite via Prisma con migration, [auth JWT con guard]. Posso spiegare ogni riga e ogni bug che ho risolto."

Bug-storie pronte: l'update che rispondeva OK ma non salvava (immutabilità e riferimenti) · il campo inventato salvato nel DB finché non ho messo la whitelist (tipi TS ≠ validazione runtime) · lo scontro CommonJS/ESM col client generato da Prisma.
