-- Kompletne dane seed dla UWAGA KAWA

-- 1. Venue
INSERT OR REPLACE INTO venues (id, name, display_name, theme, created_at, updated_at) VALUES 
('venue_kawa', 'UWAGA KAWA', 'UWAGA KAWA', 'kawa', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 2. User
INSERT OR REPLACE INTO users (id, venue_id, username, password_hash, created_at) VALUES 
('user_kawa', 'venue_kawa', 'kawa', '$2a$10$rKZLvVJ5K3qX9YxGxJ5zHOqK5qK5qK5qK5qK5qK5qK5qK5qK5qK5q', CURRENT_TIMESTAMP);

-- 3. TVs
INSERT OR REPLACE INTO tvs (id, venue_id, name, venue_name, venue_subtitle, created_at, updated_at) VALUES 
('tv_kawa_2', 'venue_kawa', 'TV1 - KAWA', 'UWAGA KAWA', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tv_s2MhLgPQAG', 'venue_kawa', 'TV 2 - JEDZENIE', 'UWAGA KAWA', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 4. Usuń stare dane menu
DELETE FROM menu_items WHERE section_id IN (SELECT id FROM menu_sections WHERE tv_id IN ('tv_kawa_2', 'tv_s2MhLgPQAG'));
DELETE FROM menu_sections WHERE tv_id IN ('tv_kawa_2', 'tv_s2MhLgPQAG');

-- 5. TV1 - KAWA - Sekcja: KAWA
INSERT INTO menu_sections (id, tv_id, title, note, display_order) VALUES 
('section_kawa_kawa', 'tv_kawa_2', 'KAWA', '*dodatkowe espresso, mleko roślinne, syrop + 2 zł', 1);

INSERT INTO menu_items (id, section_id, name, description, price, display_order) VALUES
('item_kawa_1', 'section_kawa_kawa', 'ESPRESSO / DOPPIO', '', '6 / 8', 1),
('item_kawa_2', 'section_kawa_kawa', 'ESPRESSO MACCHIATO', '', '9', 2),
('item_kawa_3', 'section_kawa_kawa', 'AMERICANO / Z MLEKIEM', 'hot / cold', '8 / 10', 3),
('item_kawa_4', 'section_kawa_kawa', 'CAPPUCCINO', 'hot / cold', '14', 4),
('item_kawa_5', 'section_kawa_kawa', 'FLAT WHITE', 'hot / cold', '15', 5),
('item_kawa_6', 'section_kawa_kawa', 'CAFFE LATTE', 'hot / cold', '16', 6),
('item_kawa_7', 'section_kawa_kawa', 'AFFOGATO', '', '13', 7),
('item_kawa_8', 'section_kawa_kawa', 'IRISH COFFEE', '', '24', 8),
('item_kawa_9', 'section_kawa_kawa', 'ESPRESSO TONIC', '', '15', 9);

-- 6. TV1 - KAWA - Sekcja: INNE NAPOJE
INSERT INTO menu_sections (id, tv_id, title, note, display_order) VALUES 
('section_kawa_inne', 'tv_kawa_2', 'INNE NAPOJE', '', 2);

INSERT INTO menu_items (id, section_id, name, description, price, display_order) VALUES
('item_inne_1', 'section_kawa_inne', 'LEMONIADA WŁASNEJ ROBOTY', '', '?', 1),
('item_inne_2', 'section_kawa_inne', 'MATCHA LATTE', 'hot / cold', '18', 2),
('item_inne_3', 'section_kawa_inne', 'HERBATA SZKLANKA / DZBANEK', '300 / 750 ml', '12 / 15', 3),
('item_inne_4', 'section_kawa_inne', 'HERBATA ZIMOWA', '300 ml', '20', 4),
('item_inne_5', 'section_kawa_inne', 'KAKAO MIĘTOWE', '', '20', 5),
('item_inne_6', 'section_kawa_inne', 'NAPAR IMBIROWO POMARAŃCZOWY', '', '20', 6),
('item_inne_7', 'section_kawa_inne', 'SMOOTHIE1', 'jabłko, pomarańcza, grejpfrut', '18', 7);

-- 7. TV2 - JEDZENIE - Sekcja: ŚNIADANIA
INSERT INTO menu_sections (id, tv_id, title, note, display_order) VALUES 
('section_jedzenie_sniadania', 'tv_s2MhLgPQAG', 'ŚNIADANIA', 'dostępne do 14:00', 1);

INSERT INTO menu_items (id, section_id, name, description, price, display_order) VALUES
('item_sniad_1', 'section_jedzenie_sniadania', 'JAJECZNICA / OMLET', '3 jajka, pieczywo', '18', 1),
('item_sniad_2', 'section_jedzenie_sniadania', 'SHAKSHUKA', 'jajka w sosie pomidorowym, pieczywo', '22', 2),
('item_sniad_3', 'section_jedzenie_sniadania', 'TOST FRANCUSKI', 'z owocami i syropem klonowym', '20', 3);

-- 8. TV2 - JEDZENIE - Sekcja: PRZEKĄSKI
INSERT INTO menu_sections (id, tv_id, title, note, display_order) VALUES 
('section_jedzenie_przekaski', 'tv_s2MhLgPQAG', 'PRZEKĄSKI', '', 2);

INSERT INTO menu_items (id, section_id, name, description, price, display_order) VALUES
('item_przek_1', 'section_jedzenie_przekaski', 'HUMMUS', 'z warzywami i pitą', '16', 1),
('item_przek_2', 'section_jedzenie_przekaski', 'BAGIETKA Z SEREM', 'ser camembert, żurawina', '18', 2),
('item_przek_3', 'section_jedzenie_przekaski', 'CIASTO DOMOWE', 'pytaj o dostępność', '12', 3);
