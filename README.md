# Barberia

A modern, bilingual website for a premium barbershop — marketing site, booking flow, and a full admin panel — built with Next.js 16, React 19, TypeScript and Tailwind CSS v4.

**🌐 Languages / Lingue / Språk:** [English](#english) · [Italiano](#italiano) · [Svenska](#svenska)

> ⚠️ **Demo project.** The admin login password is shown on the sign-in screen on purpose so a client can explore the panel. Harden it before any real deployment (see *Admin*).

---

## English

### About
Barberia is a dark, editorial barbershop site offering tailor-made barbering, grooming and wellness. It ships as a complete demo: a public marketing site (home, gallery, booking) plus a private admin panel for managing bookings, a calendar, products and inventory. The whole experience is available in **Italian (default)** and **English**.

### Features
- **Bilingual (IT / EN)** — locale-prefixed routes (`/it`, `/en`), automatic redirect for `/`, and an in-menu language toggle. All copy lives in typed dictionaries.
- **Home** — full-screen hero, "La Familia" team feature, *Shop in Shop*, services, news, animated marquee and footer.
- **Gallery** — an interactive horizontal-scroll showcase (wheel, drag, keyboard).
- **Booking flow** — service & barber selection, live availability, double-booking protection, file-backed persistence.
- **Admin panel** (bilingual, cookie session) — **Bookings**, **Calendar** (month grid), **Products** (CRUD) and **Inventory** (stock & low-stock status).
- **Brand favicon** — a generated "B" monogram (SVG + PNG).

### Tech stack
- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** with oklch tokens · **next/font** (Archivo + Inter)
- **sharp** (image processing) · **Playwright** (visual QA)

### Getting started
Requires **Node.js 24+**.

```bash
npm install
npm run dev        # start the dev server → http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run lint       # ESLint
npm run typecheck  # TypeScript check
npm run check      # lint + typecheck + build
```

### Admin
- Reachable from the menu (**Admin**) or directly at `/admin`.
- **Demo password:** `barberia` (the field is pre-filled and the hint is shown on the login screen).
- For production set the `ADMIN_PASSWORD` and `ADMIN_TOKEN` environment variables and remove the demo hint in `src/components/admin/LoginForm.tsx`.

### Data
Bookings and products are persisted as JSON under `data/` (git-ignored). Products are auto-seeded on first run, so the inventory has content to show.

### Project structure
```
src/
  app/
    [locale]/        # localized public pages (home, gallery, book)
    admin/           # admin panel: (dash) group + login
    api/             # booking + admin route handlers
  components/        # home sections, header, booking form, admin UI
  i18n/              # locales, dictionaries (en/it), shared media
  lib/               # auth, file-backed stores (bookings, products)
  types/             # Booking / Product types
public/images/       # home, gallery and product photos
scripts/             # asset processing + QA scripts
```

### Deployment
Optimized for **Vercel**. Set `ADMIN_PASSWORD` / `ADMIN_TOKEN` in the project environment before going live.

---

## Italiano

### Descrizione
Barberia è un sito editoriale dark per barbershop, dedicato a servizi di barbiere, grooming e wellness su misura. È una demo completa: un sito pubblico (home, galleria, prenotazioni) più un pannello admin privato per gestire prenotazioni, calendario, prodotti e magazzino. Tutto è disponibile in **italiano (predefinito)** e **inglese**.

### Funzionalità
- **Bilingue (IT / EN)** — route con prefisso lingua (`/it`, `/en`), redirect automatico per `/` e toggle lingua nel menu. Tutti i testi vivono in dizionari tipizzati.
- **Home** — hero a tutto schermo, sezione team "La Familia", *Shop in Shop*, servizi, news, marquee animato e footer.
- **Galleria** — showcase interattivo a scorrimento orizzontale (rotella, trascinamento, tastiera).
- **Prenotazioni** — scelta servizio e barbiere, disponibilità in tempo reale, protezione dai doppioni, persistenza su file.
- **Pannello admin** (bilingue, sessione via cookie) — **Prenotazioni**, **Calendario** (griglia mensile), **Prodotti** (CRUD) e **Magazzino** (giacenze e stato scorte).
- **Favicon del brand** — monogramma "B" generato (SVG + PNG).

### Stack tecnologico
- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** con token oklch · **next/font** (Archivo + Inter)
- **sharp** (elaborazione immagini) · **Playwright** (QA visivo)

### Avvio
Richiede **Node.js 24+**.

```bash
npm install
npm run dev        # avvia il server di sviluppo → http://localhost:3000
```

Altri comandi:

```bash
npm run build      # build di produzione
npm run lint       # ESLint
npm run typecheck  # controllo TypeScript
npm run check      # lint + typecheck + build
```

### Admin
- Raggiungibile dal menu (**Admin**) o direttamente su `/admin`.
- **Password demo:** `barberia` (il campo è precompilato e l'indizio è mostrato nella pagina di login).
- In produzione imposta le variabili d'ambiente `ADMIN_PASSWORD` e `ADMIN_TOKEN` e rimuovi l'indizio demo in `src/components/admin/LoginForm.tsx`.

### Dati
Prenotazioni e prodotti sono salvati come JSON in `data/` (escluso da git). I prodotti vengono inizializzati automaticamente al primo avvio, così il magazzino ha già contenuti.

### Struttura del progetto
```
src/
  app/
    [locale]/        # pagine pubbliche localizzate (home, galleria, prenota)
    admin/           # pannello admin: gruppo (dash) + login
    api/             # route handler prenotazioni + admin
  components/        # sezioni home, header, form prenotazione, UI admin
  i18n/              # lingue, dizionari (en/it), media condivisi
  lib/               # auth, store su file (prenotazioni, prodotti)
  types/             # tipi Booking / Product
public/images/       # foto home, galleria e prodotti
scripts/             # script di elaborazione asset + QA
```

### Deployment
Ottimizzato per **Vercel**. Imposta `ADMIN_PASSWORD` / `ADMIN_TOKEN` nell'ambiente del progetto prima della pubblicazione.

---

## Svenska

### Om projektet
Barberia är en mörk, redaktionell webbplats för en herrfrisör med skräddarsydda tjänster inom barbering, grooming och wellness. Det är en komplett demo: en publik webbplats (startsida, galleri, bokning) samt en privat adminpanel för att hantera bokningar, kalender, produkter och lager. Allt finns på **italienska (standard)** och **engelska**.

### Funktioner
- **Tvåspråkig (IT / EN)** — språkprefixade rutter (`/it`, `/en`), automatisk omdirigering för `/` och en språkväljare i menyn. All text ligger i typade ordböcker.
- **Startsida** — hero i helskärm, teamsektionen "La Familia", *Shop in Shop*, tjänster, nyheter, animerad marquee och sidfot.
- **Galleri** — ett interaktivt galleri med horisontell scroll (mushjul, dra, tangentbord).
- **Bokningsflöde** — val av tjänst och frisör, tillgänglighet i realtid, skydd mot dubbelbokning, lagring i fil.
- **Adminpanel** (tvåspråkig, cookie-session) — **Bokningar**, **Kalender** (månadsvy), **Produkter** (CRUD) och **Lager** (saldo och status för låg lagernivå).
- **Varumärkesfavicon** — ett genererat "B"-monogram (SVG + PNG).

### Teknik
- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** med oklch-tokens · **next/font** (Archivo + Inter)
- **sharp** (bildbehandling) · **Playwright** (visuell QA)

### Kom igång
Kräver **Node.js 24+**.

```bash
npm install
npm run dev        # starta utvecklingsservern → http://localhost:3000
```

Övriga kommandon:

```bash
npm run build      # produktionsbygge
npm run lint       # ESLint
npm run typecheck  # TypeScript-kontroll
npm run check      # lint + typecheck + build
```

### Admin
- Nås via menyn (**Admin**) eller direkt på `/admin`.
- **Demolösenord:** `barberia` (fältet är förifyllt och ledtråden visas på inloggningssidan).
- För produktion: sätt miljövariablerna `ADMIN_PASSWORD` och `ADMIN_TOKEN` och ta bort demoledtråden i `src/components/admin/LoginForm.tsx`.

### Data
Bokningar och produkter sparas som JSON under `data/` (ignoreras av git). Produkter seedas automatiskt vid första körningen så att lagret har innehåll att visa.

### Projektstruktur
```
src/
  app/
    [locale]/        # lokaliserade publika sidor (start, galleri, boka)
    admin/           # adminpanel: (dash)-grupp + inloggning
    api/             # route handlers för bokning + admin
  components/        # startsidans sektioner, header, bokningsformulär, admin-UI
  i18n/              # språk, ordböcker (en/it), delade media
  lib/               # auth, fil-baserade stores (bokningar, produkter)
  types/             # Booking / Product-typer
public/images/       # foton för start, galleri och produkter
scripts/             # skript för bildbehandling + QA
```

### Distribution
Optimerad för **Vercel**. Sätt `ADMIN_PASSWORD` / `ADMIN_TOKEN` i projektets miljö innan du publicerar.
