-- Dane dla lokalu KAWA
-- Najpierw usuń istniejące dane dla kawa
DELETE FROM menu_items WHERE section_id IN (SELECT id FROM menu_sections WHERE tv_id IN ('tv_kawa_2', 'tv_s2MhLgPQAG'));
DELETE FROM menu_sections WHERE tv_id IN ('tv_kawa_2', 'tv_s2MhLgPQAG');

-- TV1 - KAWA (tv_kawa_2)
-- Sekcja: KAWA
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

-- Sekcja: INNE NAPOJE
INSERT INTO menu_sections (id, tv_id, title, note, display_order) VALUES 
('section_kawa_inne', 'tv_kawa_2', 'INNE NAPOJE', '', 2);

INSERT INTO menu_items (id, section_id, name, description, price, display_order) VALUES
('item_inne_1', 'section_kawa_inne', 'LEMONIADA WŁASNEJ ROBOTY', '', '?', 1),
('item_inne_2', 'section_kawa_inne', 'MATCHA LATTE', 'hot / cold', '18', 2),
('item_inne_3', 'section_kawa_inne', 'HERBATA SZKLANKA / DZBANEK', '300 / 750 ml', '12 / 15', 3),
('item_inne_4', 'section_kawa_inne', 'HERBATA ZIMOWA', '300 ml', '20', 4),
('item_inne_5', 'section_kawa_inne', 'KAKAO MIĘTOWE', '', '20', 5),
('item_inne_6', 'section_kawa_inne', 'NAPAR IMBIROWO POMARAŃCZOWY', '', '20', 6),
('item_inne_7', 'section_kawa_inne', 'SMOOTHIE', 'jabłko, pomarańcza, grejpfrut', '18', 7);

-- TV2 - JEDZENIE (tv_s2MhLgPQAG)
-- Sekcja: OFERTA PORANNA
INSERT INTO menu_sections (id, tv_id, title, note, display_order) VALUES 
('section_kawa2_poranna', 'tv_s2MhLgPQAG', 'OFERTA PORANNA', '', 1);

INSERT INTO menu_items (id, section_id, name, description, price, display_order) VALUES
('item_poranna_1', 'section_kawa2_poranna', 'AUTORSKIE KANAPKI', '', '10 / 20', 1),
('item_poranna_2', 'section_kawa2_poranna', 'WRAPY', '', '10 / 20', 2),
('item_poranna_3', 'section_kawa2_poranna', 'BOWL', '', '18', 3);

-- Sekcja: SŁODKOŚCI
INSERT INTO menu_sections (id, tv_id, title, note, display_order) VALUES 
('section_kawa2_slodkosci', 'tv_s2MhLgPQAG', 'SŁODKOŚCI', '', 2);

INSERT INTO menu_items (id, section_id, name, description, price, display_order) VALUES
('item_slodkosci_1', 'section_kawa2_slodkosci', 'CYNAMONKA', '', '10', 1),
('item_slodkosci_2', 'section_kawa2_slodkosci', 'DROŻDŻÓWKA', '', '10', 2),
('item_slodkosci_3', 'section_kawa2_slodkosci', 'CIASTO DOMOWE NA CIEPŁO', 'GAŁKA LODÓW + 7 ZŁ', '10', 3),
('item_slodkosci_4', 'section_kawa2_slodkosci', 'LAVA CAKE', 'PODAWANE Z MUSEM MALINOWYM, GAŁKA LODÓW + 7 ZŁ', '10', 4),
('item_slodkosci_5', 'section_kawa2_slodkosci', 'NEW YORK CHEESECAKE', '', '10', 5),
('item_slodkosci_6', 'section_kawa2_slodkosci', 'LODY Z GORĄCYMI MALINAMI', '', '10', 6);

-- Sekcja: ZUPY OD GODZ. 12
INSERT INTO menu_sections (id, tv_id, title, note, display_order) VALUES 
('section_kawa2_zupy', 'tv_s2MhLgPQAG', 'ZUPY OD GODZ. 12', 'JAJKO + 2 ZŁ, PIECZYWO + 1 ZŁ', 3);

INSERT INTO menu_items (id, section_id, name, description, price, display_order) VALUES
('item_zupy_1', 'section_kawa2_zupy', 'ŻUREK', '', '15 / 20', 1),
('item_zupy_2', 'section_kawa2_zupy', 'ZUPA KREM', '', '13 / 18', 2);

-- Sekcja: WIECZORNE MENU OD GODZ. 15
INSERT INTO menu_sections (id, tv_id, title, note, display_order) VALUES 
('section_kawa2_wieczorne', 'tv_s2MhLgPQAG', 'WIECZORNE MENU OD GODZ. 15', '', 4);

INSERT INTO menu_items (id, section_id, name, description, price, display_order) VALUES
('item_wieczorne_1', 'section_kawa2_wieczorne', 'PIZZA RZYMSKA NA KAWAŁKI', '', '15 / 20', 1),
('item_wieczorne_2', 'section_kawa2_wieczorne', 'ZAPIEKANKI FIRMOWE', '', '13 / 18', 2),
('item_wieczorne_3', 'section_kawa2_wieczorne', 'QUESADILLA VEGE', '', '15', 3);
