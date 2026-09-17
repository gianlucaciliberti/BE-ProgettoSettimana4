# BE-ProgettoSettimana4

Applicazione web full stack sviluppata con Spring Boot e React + Vite.

L'app permette agli utenti di creare un account, effettuare il login, pubblicare post con una o più foto (geolocalizzati) e caricare documenti sul proprio profilo, elaborati automaticamente tramite OCR.

# Tecnologie
Java / Spring Boot
Spring Security + JWT
Spring Data JPA / Hibernate
PostgreSQL
Tess4J (OCR - Tesseract)
React + Vite
Leaflet / react-leaflet
JavaScript / JSX / CSS

# Struttura Backend
Il backend è organizzato in:

controllers → gestione delle API REST
services → logica applicativa
repositories → accesso al database
entities → entità JPA
payloads → DTO per richieste e risposte
config → configurazione della sicurezza, JWT e risorse statiche
exceptions → gestione delle eccezioni

# Modello del database

```
User
 ├── 1 → N Post          (post con didascalia, visibilità, posizione)
 │         └── 1 → N Photo   (le foto che compongono il post)
 └── 1 → N Document      (nome file, testo estratto via OCR)
```

**User**: `id`, `username`, `email`, `password`

**Post**: `id`, `caption`, `visible`, `latitude`, `longitude`, `address`, `createdAt`, `user` (ManyToOne)
La posizione (`latitude`/`longitude`/`address`) è associata al post nel suo complesso, non alle singole foto, ed è sempre facoltativa.

**Photo**: `id`, `fileName` (percorso relativo del file salvato su disco), `post` (ManyToOne)
Un post può avere una o più foto; le foto vengono eliminate a cascata quando il post viene eliminato (sia a livello di database sia come file fisici).

**Document**: `id`, `name`, `fileName`, `extractedText` (testo estratto via OCR), `user` (ManyToOne)

Le relazioni sono gestite tramite JPA (`@OneToMany` / `@ManyToOne`); le query "i miei post" e "i miei documenti" passano dai repository (`findByUserUsername...`) invece di navigare collection lato `User`.

# Autenticazione
La registrazione e il login sono gestiti tramite `AuthController`.

Dopo un login corretto, il backend restituisce un JWT.

Il frontend conserva il token e lo utilizza nelle richieste protette:

`Authorization: Bearer TOKEN`

Il `JwtAuthFilter` verifica il token e identifica l'utente autenticato.

# Endpoint API

| Metodo | Path | Body | Descrizione |
|---|---|---|---|
| POST | `/api/auth/register` | JSON | registrazione |
| POST | `/api/auth/login` | JSON | login, restituisce il JWT |
| GET | `/api/users/me` | — | profilo dell'utente autenticato |
| POST | `/api/posts` | multipart: `data` (JSON: caption, visible, latitude, longitude, address) + `photos[]` | crea un post con una o più foto |
| GET | `/api/posts` | — | post dell'utente autenticato |
| GET | `/api/posts/public` | — | feed dei post pubblici |
| PUT | `/api/posts/{id}` | JSON | modifica didascalia/visibilità/posizione di un post (le foto non sono modificabili: per cambiarle si elimina e ricrea il post) |
| DELETE | `/api/posts/{id}` | — | elimina un post, le sue foto e i relativi file |
| POST | `/api/documents` | multipart: `name` + `file` | carica un documento ed estrae il testo tramite OCR |
| GET | `/api/documents` | — | documenti dell'utente autenticato, con testo estratto |
| DELETE | `/api/documents/{id}` | — | elimina un documento e il relativo file |

I file caricati (foto e documenti) sono serviti come risorse statiche sotto `/uploads/**`.

# Scelte implementative

**Upload dei file** — Le foto e i documenti vengono caricati come `multipart/form-data` reale (non più come URL testuali). `FileStorageService` valida sia l'estensione sia il content-type dichiarato (sono ammessi solo JPG, PNG, WEBP), genera un nome file univoco (UUID) e salva il file sotto la cartella locale `uploads/` (esclusa dal versionamento). Un formato non valido produce un errore `400` gestito da `GlobalExceptionHandler`. La stessa whitelist di formati è applicata anche lato frontend prima dell'invio, per dare un feedback immediato senza attendere la risposta del server.

**Post con più foto** — Ogni post (`Post`) può contenere una o più foto (`Photo`, in relazione `@OneToMany`), create sia tramite selezione di più file da upload sia tramite acquisizione diretta dalla fotocamera (`<input type="file" capture="environment">`).

**Geolocalizzazione** — La posizione viene scelta cliccando su una mappa oppure cercando un indirizzo testuale, tramite **Leaflet** (rendering della mappa, tile OpenStreetMap) e **Nominatim** (geocoding/reverse-geocoding, servizio gratuito di OpenStreetMap, senza necessità di API key). La posizione è sempre facoltativa e viene salvata a livello di post.

**OCR sui documenti** — I documenti caricati vengono elaborati tramite **Tess4J**, un binding Java per il motore Tesseract OCR. Tess4J include il proprio motore nativo nel jar; è necessario solo configurare il percorso dei dati linguistici (`tessdata`) tramite la proprietà `tesseract.datapath` in `application.properties`, puntata all'installazione locale di Tesseract (`C:/Program Files/Tesseract-OCR/tessdata`). L'estrazione avviene in modo sincrono al momento dell'upload e il testo estratto viene salvato insieme al documento.

# Librerie e servizi esterni

- **Tess4J** — OCR (estrazione testo da immagini)
- **Leaflet / react-leaflet** — rendering mappa interattiva
- **Nominatim (OpenStreetMap)** — geocoding e reverse-geocoding via API pubblica, gratuita, senza chiave

# Frontend
Il frontend è sviluppato con React + Vite e comprende:

registrazione;
login;
dashboard;
profilo personale;
creazione di post con una o più foto (upload o cattura da fotocamera) e posizione opzionale;
modifica di didascalia/visibilità/posizione di un post;
visualizzazione dei contenuti pubblici;
caricamento di documenti con visualizzazione del testo estratto via OCR.

Il frontend comunica con il backend tramite API REST.

# Obiettivo
Il progetto mette in pratica:

API REST;
autenticazione JWT;
Spring Security;
relazioni JPA;
DTO e validazione;
upload di file multipart e validazione dei formati;
integrazione con servizi/librerie esterne (OCR, mappe, geocoding);
gestione degli utenti;
comunicazione tra backend e frontend.
