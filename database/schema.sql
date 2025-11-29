-- Schema dla systemu menu CMS z wieloma lokalami

-- Tabela lokali (venues)
CREATE TABLE IF NOT EXISTS venues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  theme TEXT NOT NULL DEFAULT 'kawa',
  logo_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela użytkowników
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  venue_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor', -- admin, editor, viewer
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
);

-- Tabela telewizorów
CREATE TABLE IF NOT EXISTS tvs (
  id TEXT PRIMARY KEY,
  venue_id TEXT NOT NULL,
  name TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  venue_subtitle TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
);

-- Tabela sekcji menu
CREATE TABLE IF NOT EXISTS menu_sections (
  id TEXT PRIMARY KEY,
  tv_id TEXT NOT NULL,
  title TEXT NOT NULL,
  note TEXT,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tv_id) REFERENCES tvs(id) ON DELETE CASCADE
);

-- Tabela pozycji menu
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT,
  display_order INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES menu_sections(id) ON DELETE CASCADE
);

-- Tabela linków do telewizorów (dla TV mode)
CREATE TABLE IF NOT EXISTS tv_links (
  id TEXT PRIMARY KEY,
  tv_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tv_id) REFERENCES tvs(id) ON DELETE CASCADE
);

-- Indeksy dla wydajności
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_venue ON users(venue_id);
CREATE INDEX IF NOT EXISTS idx_tvs_venue ON tvs(venue_id);
CREATE INDEX IF NOT EXISTS idx_sections_tv ON menu_sections(tv_id);
CREATE INDEX IF NOT EXISTS idx_items_section ON menu_items(section_id);
CREATE INDEX IF NOT EXISTS idx_tv_links_token ON tv_links(token);

-- Dane początkowe
INSERT INTO venues (id, name, display_name, theme) VALUES
  ('venue_kawa', 'kawa', 'UWAGA KAWA', 'kawa'),
  ('venue_norblin', 'norblin', 'Norblin', 'norblin'),
  ('venue_piwna', 'piwna', 'UWAGA PIWO', 'piwna');

-- Użytkownicy (hasła: bcrypt hash dla 'kawa', 'norblin', 'piwna')
-- W produkcji użyj prawdziwych hashy bcrypt
INSERT INTO users (id, username, password_hash, venue_id, role) VALUES
  ('user_kawa', 'kawa', 'kawa', 'venue_kawa', 'admin'),
  ('user_norblin', 'norblin', 'norblin', 'venue_norblin', 'admin'),
  ('user_piwna', 'piwna', 'piwna', 'venue_piwna', 'admin');

-- Telewizory dla Kawa
INSERT INTO tvs (id, venue_id, name, venue_name, venue_subtitle, display_order) VALUES
  ('tv_kawa_1', 'venue_kawa', 'TV1 - Kawa', 'UWAGA KAWA', 'POLISH COFFEE ROASTERS', 1),
  ('tv_kawa_2', 'venue_kawa', 'TV2 - Kawa', 'UWAGA KAWA', 'POLISH COFFEE ROASTERS', 2);

-- Telewizor dla Norblin
INSERT INTO tvs (id, venue_id, name, venue_name, venue_subtitle, display_order) VALUES
  ('tv_norblin_1', 'venue_norblin', 'TV Norblin', 'Norblin', '', 1);

-- Telewizor dla Piwna
INSERT INTO tvs (id, venue_id, name, venue_name, venue_subtitle, display_order) VALUES
  ('tv_piwna_1', 'venue_piwna', 'TV Piwna - Przekąski', 'UWAGA PIWO', 'POLISH CRAFT BEER', 1);
