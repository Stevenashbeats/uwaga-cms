# UWAGA KAWA Menu Editor v2.0

System CMS do zarządzania menu dla wielu lokali z niezależnymi telewizorami i układami.

## 🏗️ Architektura

### Backend (Cloudflare Workers)
- **D1 Database** - Relacyjna baza danych SQL
- **R2 Storage** - Przechowywanie obrazów (loga, zdjęcia)
- **Workers** - Serverless API endpoints
- **KV** - Sesje użytkowników (opcjonalne)

### Frontend
- Vanilla JavaScript
- Responsive design
- Multi-theme support (Kawa, Norblin, Piwna)

## 🚀 Quick Start

### 1. Setup Backend

Szczegółowe instrukcje w [SETUP-DATABASE.md](./SETUP-DATABASE.md)

```bash
# Zainstaluj Wrangler CLI
npm install -g wrangler

# Zaloguj się do Cloudflare
wrangler login

# Utwórz bazę danych
wrangler d1 create uwaga-kawa-db

# Zaktualizuj wrangler.toml z database_id

# Inicjalizuj schema
wrangler d1 execute uwaga-kawa-db --file=./database/schema.sql --remote

# Utwórz R2 bucket
wrangler r2 bucket create uwaga-kawa-assets

# Zainstaluj zależności
npm install

# Uruchom lokalnie
npm run dev

# Deploy
npm run deploy
```

### 2. Domyślni Użytkownicy

Po inicjalizacji bazy danych dostępni są:

| Lokal | Login | Hasło | Theme |
|-------|-------|-------|-------|
| UWAGA KAWA | kawa | kawa | kawa |
| Norblin | norblin | norblin | norblin |
| UWAGA PIWO | piwna | piwna | piwna |

⚠️ **Zmień hasła w produkcji!**

## 📁 Struktura Projektu

```
uwaga-kawa-cms/
├── database/
│   └── schema.sql          # Schema bazy danych
├── src/
│   ├── worker.js           # Cloudflare Worker (API)
│   └── api-client.js       # Frontend API client
├── pictures/               # Obrazy (loga)
├── font/                   # Czcionki
├── index.html             # Główna strona
├── app.js                 # Logika aplikacji
├── auth.js                # Autentykacja (legacy)
├── style.css              # Style (multi-theme)
├── wrangler.toml          # Konfiguracja Cloudflare
├── package.json           # Zależności
└── SETUP-DATABASE.md      # Instrukcje setup

```

## 🎨 Themes

System wspiera różne motywy dla każdego lokalu:

### Kawa (theme: 'kawa')
- Jasne tło z kropkami
- Czarna czcionka Evogria
- Logo UWAGA KAWA

### Norblin (theme: 'norblin')
- Do skonfigurowania

### Piwna (theme: 'piwna')
- Czarne tło
- Żółte akcenty (#fdb616)
- Białe teksty
- Logo UWAGA PIWO
- Czcionka Barlow Condensed dla opisów

## 🔌 API Endpoints

### Auth
```
POST /api/auth/login
Body: { username, password }
Response: { token, user }
```

### TVs
```
GET    /api/tvs              - Lista TV
GET    /api/tvs/:id          - Szczegóły TV
POST   /api/tvs              - Utwórz TV
PUT    /api/tvs/:id          - Aktualizuj TV
DELETE /api/tvs/:id          - Usuń TV
```

### Sections
```
POST   /api/tvs/:tvId/sections    - Utwórz sekcję
PUT    /api/sections/:id          - Aktualizuj sekcję
DELETE /api/sections/:id          - Usuń sekcję
```

### Items
```
POST   /api/sections/:sectionId/items  - Utwórz pozycję
PUT    /api/items/:id                  - Aktualizuj pozycję
DELETE /api/items/:id                  - Usuń pozycję
```

### TV Links (publiczne linki)
```
POST /api/tvs/:tvId/link    - Generuj link
GET  /api/tv/:token         - Pobierz TV (publiczne)
```

### Upload
```
POST /api/upload
Body: FormData with 'file'
Response: { url }
```

## 🔐 Bezpieczeństwo

Obecna wersja używa prostego auth dla development.

**TODO dla produkcji:**
- [ ] Bcrypt hash dla haseł
- [ ] Prawdziwe JWT tokeny
- [ ] Rate limiting
- [ ] HTTPS only
- [ ] CORS dla konkretnych domen
- [ ] Input validation
- [ ] SQL injection protection (prepared statements ✅)

## 💰 Koszty

Cloudflare Free Tier:
- Workers: 100,000 req/day ✅
- D1: 5GB storage, 5M reads/day ✅
- R2: 10GB storage ✅

**Dla małego projektu = DARMOWE! 🎉**

## 🛠️ Development

```bash
# Lokalny development
npm run dev

# Deploy do produkcji
npm run deploy

# Sprawdź logi
wrangler tail

# Wykonaj query na bazie
wrangler d1 execute uwaga-kawa-db --command="SELECT * FROM venues"
```

## 📝 TODO

- [ ] Migracja frontendu do API
- [ ] Prawdziwy JWT auth
- [ ] Drag & drop dla zmiany kolejności
- [ ] Upload logo przez UI
- [ ] Eksport/import menu (JSON)
- [ ] Historia zmian (audit log)
- [ ] Multi-language support
- [ ] Dark mode dla edytora
- [ ] Mobile app (PWA)

## 📄 Licencja

Proprietary - UWAGA KAWA

## 👥 Autorzy

Developed with ❤️ for UWAGA KAWA, Norblin & UWAGA PIWO

System zarządzania menu kawiarni zoptymalizowany pod wyświetlanie na telewizorach pionowych **1080x1920px**.  
**Obsługuje wiele telewizorów** - możesz tworzyć osobne menu dla różnych TV (np. napoje, jedzenie).

## 🚀 Jak używać

### 1. Zarządzanie telewizorami
- **Wybierz telewizor** - lista rozwijana na górze edytora
- **Dodaj nowy TV** - przycisk `+`
- **Zmień nazwę** - przycisk `✏️`
- **Usuń TV** - przycisk `🗑️`
- Domyślnie: TV 1 (Napoje), TV 2 (Jedzenie)

### 2. Edycja menu
- Wybierz telewizor z listy
- Edytuj nazwę lokalu, podtytuł
- Dodawaj/usuwaj sekcje menu
- Dodawaj/usuwaj pozycje w sekcjach
- Edytuj nazwy, opisy i ceny

### 3. Generowanie linku dla TV
- Wybierz telewizor, który chcesz udostępnić
- Kliknij **"📺 Generuj link dla TV (1080x1920)"**
- Skopiuj wygenerowany link
- Link zawiera parametr `?tv=1` - ukrywa panel edytora
- Link zawiera parametr `?tvid=...` - ID wybranego telewizora
- Link zawiera parametr `?d=...` - zakodowane menu

### 4. Wyświetlanie na TV
- Otwórz wygenerowany link na telewizorze
- Menu wyświetli się w formacie **1080x1920px** (pionowy)
- Bez panelu edytora - tylko czyste menu
- Tło z obrazka `pictures/back_tv1.png`
- Logo z pliku `pictures/LogoKawa.svg`

## 📐 Specyfikacja techniczna

- **Format:** 1080x1920px (9:16, pionowy)
- **Czcionka:** Evogria (z folderu `font/`)
- **Tło:** `pictures/back_tv1.png`
- **Logo:** `pictures/LogoKawa.svg`
- **Sekcje:** Przezroczyste z czarną ramką
- **Ceny:** Czarne, pogrubione, bez obramówki

## 📁 Struktura plików

```
windsurf-project-4/
├── index.html          # Główny plik HTML
├── style.css           # Style CSS
├── app.js              # Logika JavaScript
├── font/               # Czcionki
│   ├── Evogria.otf
│   └── Evogria Italic.otf
└── pictures/           # Grafiki
    ├── back_tv1.png    # Tło
    └── LogoKawa.svg    # Logo
```

## 🎨 Tryby wyświetlania

### Tryb edytora (domyślny)
```
http://localhost/index.html
```
- Panel edytora po lewej
- Podgląd po prawej

### Tryb TV (tylko menu)
```
http://localhost/index.html?tv=1&d=...
```
- Tylko menu, bez edytora
- Format 1080x1920px
- Gotowe do wyświetlenia na TV

## 💡 Wskazówki

1. **Edycja na komputerze** - używaj trybu edytora
2. **Wyświetlanie na TV** - używaj wygenerowanego linku z `?tv=1`
3. **Backup menu** - zapisz wygenerowany link jako backup
4. **Aktualizacja** - edytuj w trybie edytora, wygeneruj nowy link
