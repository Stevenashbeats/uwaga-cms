# Setup Bazy Danych - Cloudflare Workers + D1 + R2

## Wymagania
- Konto Cloudflare (darmowe)
- Node.js 18+
- npm lub yarn

## Krok 1: Instalacja Wrangler CLI

```bash
npm install -g wrangler
# lub
yarn global add wrangler
```

## Krok 2: Logowanie do Cloudflare

```bash
wrangler login
```

## Krok 3: Utworzenie bazy danych D1

```bash
# Utwórz bazę danych
wrangler d1 create uwaga-kawa-db

# Skopiuj database_id z outputu i wklej do wrangler.toml
```

Output będzie wyglądał tak:
```
✅ Successfully created DB 'uwaga-kawa-db'

[[d1_databases]]
binding = "DB"
database_name = "uwaga-kawa-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

## Krok 4: Zaktualizuj wrangler.toml

Otwórz `wrangler.toml` i zamień `your-database-id-here` na prawdziwy ID z poprzedniego kroku.

## Krok 5: Inicjalizacja schematu bazy danych

```bash
# Wykonaj schema.sql
wrangler d1 execute uwaga-kawa-db --file=./database/schema.sql --remote
```

## Krok 6: Utworzenie R2 Bucket dla obrazów

```bash
# Utwórz bucket
wrangler r2 bucket create uwaga-kawa-assets
```

## Krok 7: Utworzenie KV namespace dla sesji (opcjonalne)

```bash
# Utwórz KV namespace
wrangler kv:namespace create "SESSIONS"

# Skopiuj ID i wklej do wrangler.toml
```

## Krok 8: Instalacja zależności projektu

```bash
npm install
# lub
yarn install
```

## Krok 9: Testowanie lokalnie

```bash
# Uruchom worker lokalnie
npm run dev
# lub
wrangler dev
```

Worker będzie dostępny pod `http://localhost:8787`

## Krok 10: Deploy do produkcji

```bash
npm run deploy
# lub
wrangler deploy
```

## Krok 11: Konfiguracja domeny (opcjonalne)

W Cloudflare Dashboard:
1. Przejdź do Workers & Pages
2. Wybierz swój worker `uwaga-kawa-cms`
3. Kliknij "Settings" → "Triggers"
4. Dodaj Custom Domain (np. `api.uwaga-kawa.com`)

## Struktura Bazy Danych

### Tabele:
- **venues** - Lokale (Kawa, Norblin, Piwna)
- **users** - Użytkownicy z dostępem do lokali
- **tvs** - Telewizory przypisane do lokali
- **menu_sections** - Sekcje menu (np. PIZZA, FRIES)
- **menu_items** - Pozycje w sekcjach
- **tv_links** - Linki do udostępniania TV mode

### Relacje:
```
venues (1) → (N) users
venues (1) → (N) tvs
tvs (1) → (N) menu_sections
menu_sections (1) → (N) menu_items
tvs (1) → (N) tv_links
```

## API Endpoints

### Auth
- `POST /api/auth/login` - Logowanie

### TVs
- `GET /api/tvs` - Lista TV dla zalogowanego użytkownika
- `GET /api/tvs/:id` - Szczegóły TV
- `POST /api/tvs` - Utwórz nowy TV
- `PUT /api/tvs/:id` - Aktualizuj TV
- `DELETE /api/tvs/:id` - Usuń TV

### Sections
- `POST /api/tvs/:tvId/sections` - Utwórz sekcję
- `PUT /api/sections/:id` - Aktualizuj sekcję
- `DELETE /api/sections/:id` - Usuń sekcję

### Items
- `POST /api/sections/:sectionId/items` - Utwórz pozycję
- `PUT /api/items/:id` - Aktualizuj pozycję
- `DELETE /api/items/:id` - Usuń pozycję

### TV Links
- `POST /api/tvs/:tvId/link` - Generuj link do TV
- `GET /api/tv/:token` - Pobierz TV po tokenie (publiczne)

### Upload
- `POST /api/upload` - Upload obrazu do R2

## Bezpieczeństwo

⚠️ **WAŻNE**: Obecna implementacja używa prostego systemu auth dla development.

W produkcji:
1. Zamień hasła na bcrypt hash
2. Użyj prawdziwych JWT tokenów
3. Dodaj rate limiting
4. Włącz HTTPS only
5. Skonfiguruj CORS dla konkretnych domen

## Koszty

Cloudflare oferuje darmowy tier:
- **Workers**: 100,000 requestów/dzień
- **D1**: 5GB storage, 5M reads/day, 100K writes/day
- **R2**: 10GB storage, 1M Class A operations/month

Dla małego projektu to całkowicie wystarczy! 🎉

## Troubleshooting

### Problem: "Database not found"
```bash
# Sprawdź listę baz danych
wrangler d1 list

# Upewnij się, że ID w wrangler.toml jest poprawne
```

### Problem: "Unauthorized"
```bash
# Zaloguj się ponownie
wrangler logout
wrangler login
```

### Problem: "Module not found"
```bash
# Zainstaluj zależności
npm install
```

## Następne kroki

Po setupie backendu:
1. Zaktualizuj frontend do używania API (`src/api-client.js`)
2. Zmigruj auth.js do używania API
3. Zmigruj app.js do używania API
4. Przetestuj wszystkie funkcje
5. Deploy frontendu na Cloudflare Pages
