-- Dodaj kolumnę global_scale do tabeli tvs
ALTER TABLE tvs ADD COLUMN global_scale INTEGER DEFAULT 100;
