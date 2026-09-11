# BE-ProgettoSettimana4

Applicazione web full stack sviluppata con Spring Boot e React + Vite.

L'app permette agli utenti di creare un account, effettuare il login e gestire una raccolta personale di foto e documenti.

# Tecnologie
Java / Spring Boot
Spring Security + JWT
Spring Data JPA / Hibernate
React + Vite
JavaScript / JSX / CSS

# Struttura Backend
Il backend è organizzato in:

controllers → gestione delle API REST
services → logica applicativa
repositories → accesso al database
entities → entità JPA
payloads → DTO per richieste e risposte
config → configurazione della sicurezza e JWT
exception → gestione delle eccezioni

# Relazioni tra entità
L'entità principale è User.

Un utente può avere più foto e più documenti.

User
 ├── 1 → N Photo
 └── 1 → N Document

Le relazioni sono gestite tramite JPA:
User → @OneToMany
Photo → @ManyToOne
Document → @ManyToOne

In questo modo ogni foto e ogni documento appartiene a uno specifico utente.

# Autenticazione
La registrazione e il login sono gestiti tramite AuthController.

Dopo un login corretto, il backend restituisce un JWT.

Il frontend conserva il token e lo utilizza nelle richieste protette:

Authorization: Bearer TOKEN

Il JwtAuthFilter verifica il token e identifica l'utente autenticato.

# Gestione delle foto
L'utente può:

aggiungere foto;
visualizzare le proprie foto;
modificare titolo e dati;
impostare una foto come pubblica o privata;
eliminare le proprie foto.
📄 Gestione dei documenti

L'utente può:

aggiungere un documento tramite URL;
visualizzare i propri documenti;
eliminare i documenti.

# Frontend
Il frontend è sviluppato con React + Vite e comprende:

registrazione;
login;
dashboard;
profilo personale;
gestione delle foto;
visualizzazione dei contenuti pubblici;
gestione dei documenti.

Il frontend comunica con il backend tramite API REST.

# Obiettivo
Il progetto mette in pratica:

API REST;
autenticazione JWT;
Spring Security;
relazioni JPA;
DTO e validazione;
gestione degli utenti;
comunicazione tra backend e frontend.

# Possibili migliorie
Implementare geolocalizzazione, gestire diversamente pubblicazione e visualizzazione post.