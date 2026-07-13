# Plan — Giorno 2: validazione DTO e gestione input

**Data:** 2026-07-13
**Status:** completed (2026-07-13) — vedi [tasks.md](../tasks.md). Bug notevoli risolti in corso d'opera: DTO senza decoratori = whitelist respinge tutto; typo `complete`/`completed` invisibile al compilatore
**Riferimento:** Giorno 2 del [piano di studio](../../../cross-cutting/2026-07-07-piano-studio-nestjs.md)

## Punto di partenza (verificato con esperimento)

PATCH con body `{"completed":true, "campoInventato":"ciao"}` → il server salva entrambi i campi, benché non esistano nei DTO. Dimostrato il 2026-07-13: i tipi TypeScript non filtrano nulla a runtime.

## Obiettivo

Mettere la validazione vera sull'input del modulo tasks: campi sconosciuti rifiutati, campi obbligatori verificati, id di rotta convertiti in modo idiomatico.

## Scope

- Installare class-validator + class-transformer
- Decoratori di validazione su `CreateTaskDto` (UpdateTaskDto li eredita via PartialType di @nestjs/mapped-types)
- `ValidationPipe` globale in `main.ts` con `whitelist` + `forbidNonWhitelisted`
- `ParseIntPipe` sui param `:id` al posto del `+id`
- Retest: il campo inventato deve produrre 400

## Fuori scope

- Validazioni custom / pipe custom (accenno teorico, niente codice)
- Exception filter custom (il default di Nest basta)

## Rischi / note

- Interview alle porte (~11–14 lug): se il tempo stringe, ParseIntPipe è comprimibile; whitelist e ValidationPipe no — sono domanda fissa da colloquio
