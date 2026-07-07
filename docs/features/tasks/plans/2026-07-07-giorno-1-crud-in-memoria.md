# Plan — Giorno 1: modulo tasks con CRUD in memoria

**Data:** 2026-07-07
**Status:** in corso
**Riferimento:** Giorno 1 del [piano di studio](../../../cross-cutting/2026-07-07-piano-studio-nestjs.md)

## Obiettivo

Primo modulo vero dell'app TaskFlow: `tasks` con CRUD completo (create, findAll, findOne, update, remove), dati in un array in memoria dentro il service. Obiettivo didattico: capire Module/Controller/Provider, DI e decoratori di routing usando codice reale.

## Scope

- Lettura guidata dello scaffold esistente (main.ts, app.module, app.controller, app.service)
- Generazione del resource con la CLI (`nest g resource tasks`) e spiegazione dei file generati
- Entity `Task` (id numerico, title, description, completed, createdAt)
- Implementazione CRUD in memoria nel `TasksService` con pattern immutabile
- Verifica manuale degli endpoint con richieste HTTP

## Fuori scope (volutamente, arrivano nei giorni dopo)

- Validazione dei DTO (Giorno 2) — oggi i DTO sono classi "nude"
- Gestione 404 con NotFoundException (Giorno 2) — oggi un id inesistente risponde vuoto
- Persistenza su database (Giorno 3)

## Rischi / note

- La CLI genera anche i file .spec: li teniamo, verranno usati al Giorno 5
- Windows/PowerShell: la CLI va lanciata con i flag non interattivi per evitare prompt
