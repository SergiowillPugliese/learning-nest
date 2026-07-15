# Feature: auth (Giorno 4 — JWT completo)

**Ultimo aggiornamento:** 2026-07-15
**Stato:** register + login + guard funzionanti e testati. Ownership task→user NON implementata (scelta di taglio pre-colloquio: si racconta).

## Panoramica

Autenticazione JWT senza Passport (approccio della documentazione ufficiale Nest): un solo modulo `auth` che copre registrazione, login e protezione delle rotte. Il modulo `tasks` è interamente protetto dal guard.

## Endpoints

| Metodo | URL | Esiti |
|---|---|---|
| POST | /auth/register | **201** utente senza password · **409** email già registrata |
| POST | /auth/login | **200** `{ access_token }` (`@HttpCode(OK)`: il login non crea risorse) · **401** credenziali errate |
| * | /tasks/** | protetti da `AuthGuard`: **401** senza/con token invalido |

## Componenti

- **`AuthService`**: `register` (check duplicato → 409, hash bcrypt costo 10, create con `select` che esclude la password), `login` (findByEmail → 401, `bcrypt.compare` → 401, `signAsync({ sub, email })`), `findByEmail` (query pura, ritorna `User | null` — il significato di null lo decide il chiamante)
- **`AuthGuard`** (`CanActivate`): estrae il Bearer token dall'header, `verifyAsync` in try/catch (traduzione errore-libreria → `UnauthorizedException`), appende il payload a `request.user`, applicato a livello di classe su `TasksController` con `@UseGuards`
- **`JwtModule.register({ global: true, secret: process.env.JWT_SECRET, signOptions: { expiresIn: '1h' } })`** — secret nel `.env`, mai committato
- **`AuthCredentialsDto`**: `@IsEmail`, `@MinLength(8)` — riusato da register e login

## Decisioni prese (e perché)

1. **Niente Passport**: guard custom con @nestjs/jwt — meno astrazione, ogni passaggio spiegabile
2. **Un solo modulo auth** (niente users separato): in un progetto più grande l'anagrafica andrebbe separata
3. **Stesso messaggio "Invalid credentials"** per email inesistente E password errata → prevenzione user enumeration
4. **La password non esce mai dal layer dati**: `select` esplicito nella create (il tipo generato non contiene proprio il campo)
5. **Nel guard si LANCIA, non si ritorna false**: `return false` produce il 403 di default; token mancante = "non so chi sei" = 401
6. **try/catch SOLO attorno a `verifyAsync`**: il caso in cui il catch aggiunge valore (traduce l'errore jwt in eccezione HTTP); altrove le eccezioni risalgono all'exception layer

## Bug istruttivi incontrati

- try/catch generici che catturavano le proprie eccezioni → ogni strada dava 500 (lezione: lasciar risalire, lanciare eccezioni HTTP semantiche)
- `return false` nel guard → 403 inatteso al posto del 401
- `window.token` sparito col reload della pagina → test col token letterale `"Bearer undefined"` (che il guard ha giustamente rifiutato)

## Domande da colloquio (Giorno 4) — con le risposte

**1. Descrivi il flusso di autenticazione JWT.**
Register: salvo l'utente con la password hashata (bcrypt), mai in chiaro. Login: ricalcolo l'hash e confronto (`bcrypt.compare`); se ok firmo un token col secret del server (`payload: sub, email` + scadenza) e lo consegno. Richieste successive: il client manda `Authorization: Bearer <token>`, un guard verifica la firma e appende il payload alla request. Stateless: nessuna sessione server-side, qualunque istanza può verificare.

**2. Perché bcrypt e non cifratura (o MD5/SHA)?**
La cifratura è reversibile: chi ruba DB+chiave ha le password. L'hash è a senso unico. MD5/SHA sono hash ma VELOCI, quindi vulnerabili a forza bruta; bcrypt è lento per progetto (costo configurabile) e incorpora il salt, che neutralizza le rainbow table e differenzia hash di password uguali.

**3. Il JWT è cifrato?**
No: è FIRMATO. Header e payload sono base64 leggibile da chiunque (mai metterci dati sensibili); la firma HMAC col secret garantisce che nessuno possa alterarlo. Verificabile su jwt.io.

**4. 401 vs 403?**
401 = "non so chi sei" (autenticazione mancante/invalida). 403 = "so chi sei, ma non hai i permessi" (autenticato, non autorizzato). Token mancante → 401; utente normale su rotta admin → 403.

**5. Guard di Nest vs guard di Angular?**
Stessa interfaccia concettuale (`CanActivate`), scopo diverso: quello di Angular è UX client-side (aggirabile da devtools), quello di Nest è sicurezza server-side. Il guard Nest riceve un `ExecutionContext` (astrazione multi-trasporto), da cui si estrae la request HTTP.

**6. Come implementeresti l'ownership dei task?**
Relazione 1-N nello schema (`userId` FK su Task), il guard mette il payload in `request.user`, nel service filtro/creo con `where: { userId: user.sub }`. Per pulizia, un custom decorator `@CurrentUser()` per estrarre l'utente nell'handler. (Non implementata per scelta di tempo — so descriverla.)

**7. Come gestisci scadenza e revoca?**
Scadenza: claim `exp` via `expiresIn` — il guard rifiuta i token scaduti automaticamente. Revoca: punto debole dello stateless puro; mitigazioni: scadenze brevi + refresh token, o blacklist/versioning lato server (con costo: si reintroduce stato).

## Micro-esercizio post-colloquio

Implementare davvero l'ownership: migration con `userId`, filtro nel TasksService, decorator `@CurrentUser()`.
