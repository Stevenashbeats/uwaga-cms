# 🔄 JAK ZROBIĆ HARD REFRESH

## Problem
Przeglądarka trzyma starą wersję plików JavaScript w cache. Musisz wymusić pobranie nowych plików.

## Rozwiązanie

### Na Windows:
1. **Ctrl + Shift + R** (Chrome, Firefox, Edge)
2. Lub **Ctrl + F5**
3. Lub otwórz DevTools (F12) → kliknij prawym na przycisk odśwież → "Wyczyść pamięć podręczną i odśwież"

### Na Mac:
1. **Cmd + Shift + R** (Chrome, Firefox, Safari)
2. Lub **Cmd + Option + R** (Safari)
3. Lub otwórz DevTools (Cmd + Option + I) → kliknij prawym na przycisk odśwież → "Empty Cache and Hard Reload"

## Jak sprawdzić czy zadziałało?

1. Otwórz Console (F12)
2. Przesuń slider fontów
3. Powinieneś zobaczyć:
   ```
   📝 Font scale changed to: 150%
   💾 Saved to currentTv: 150
   🔤 Applying font scale: 150%
   ```

4. Kliknij "Zapisz zmiany"
5. Powinieneś zobaczyć:
   ```
   📊 Font scale to save: 150
   ✅ TV zapisane, odpowiedź: {...}
   ✅ Zapisane font_scale: 150
   ```

## Jeśli nadal nie działa:

1. Wyczyść całą pamięć podręczną:
   - Chrome: Settings → Privacy → Clear browsing data → Cached images and files
   - Firefox: Settings → Privacy → Clear Data → Cached Web Content
   
2. Zamknij i otwórz przeglądarkę ponownie

3. Spróbuj w trybie incognito/prywatnym
