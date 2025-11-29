// System synchronizacji danych między edytorem a telewizorami

// Zapisz stan do localStorage
function saveToLocalStorage() {
  try {
    localStorage.setItem('uwaga-kawa-menu-data', JSON.stringify(appState));
    localStorage.setItem('uwaga-kawa-last-update', Date.now().toString());
  } catch (e) {
    console.error('Błąd zapisu do localStorage:', e);
  }
}

// Wczytaj stan z localStorage
function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem('uwaga-kawa-menu-data');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Zachowaj currentTvId jeśli jest ustawiony z URL
      const currentTvId = appState.currentTvId;
      appState = parsed;
      if (currentTvId) {
        appState.currentTvId = currentTvId;
      }
      return true;
    }
  } catch (e) {
    console.error('Błąd odczytu z localStorage:', e);
  }
  return false;
}

// Nasłuchuj zmian w localStorage (synchronizacja między kartami) - TYLKO DLA TV
window.addEventListener('storage', (e) => {
  if (e.key === 'uwaga-kawa-menu-data') {
    const params = new URLSearchParams(window.location.search);
    const isTVMode = params.get("tv") === "1";
    
    // Tylko tryb TV odświeża się automatycznie
    if (isTVMode) {
      console.log('Wykryto zmianę danych - odświeżanie TV...');
      loadFromLocalStorage();
      if (typeof renderPreview === 'function') {
        renderPreview();
      }
    }
  }
});

// Śledzenie zmian
let hasUnsavedChanges = false;

function markAsChanged() {
  hasUnsavedChanges = true;
  updateSaveButton();
}

function markAsSaved() {
  hasUnsavedChanges = false;
  updateSaveButton();
}

function updateSaveButton() {
  const saveBtn = document.getElementById('save-btn');
  const saveInfo = document.getElementById('save-info');
  
  if (saveBtn) {
    if (hasUnsavedChanges) {
      saveBtn.classList.add('has-changes');
      saveBtn.textContent = '💾 Zapisz zmiany';
    } else {
      saveBtn.classList.remove('has-changes');
      saveBtn.textContent = '✓ Zapisano';
    }
  }
  
  if (saveInfo) {
    if (hasUnsavedChanges) {
      saveInfo.textContent = 'Niezapisane zmiany';
      saveInfo.style.color = '#ff9800';
    } else {
      saveInfo.textContent = 'Wszystko zapisane';
      saveInfo.style.color = '#4caf50';
    }
  }
}

// Eksportuj funkcje
window.markAsChanged = markAsChanged;
window.markAsSaved = markAsSaved;

// Generuj unikalne linki dla każdego TV
function generateTvLink(tvId) {
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set("tv", "1");
  url.searchParams.set("tvid", tvId);
  return url.toString();
}

// Inicjalizacja przy starcie
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const tvid = params.get("tvid");
  const isTVMode = params.get("tv") === "1";
  
  // Wczytaj z localStorage jeśli nie ma danych w URL
  if (!params.get("d")) {
    const loaded = loadFromLocalStorage();
    if (loaded && tvid && appState.tvs && appState.tvs[tvid]) {
      appState.currentTvId = tvid;
    }
  }
  
  // W trybie TV ustaw currentTvId z URL
  if (isTVMode && tvid && appState.tvs && appState.tvs[tvid]) {
    appState.currentTvId = tvid;
  }
  
  // Obsługa przycisku Zapisz
  const saveBtn = document.getElementById('save-btn');
  if (saveBtn && !isTVMode) {
    saveBtn.addEventListener('click', () => {
      saveToLocalStorage();
      markAsSaved();
      
      // Pokaż feedback
      saveBtn.textContent = '✓ Zapisano!';
      setTimeout(() => {
        updateSaveButton();
      }, 2000);
    });
    
    // Początkowy stan
    markAsSaved();
  }
});

// Eksportuj funkcje
window.saveToLocalStorage = saveToLocalStorage;
window.loadFromLocalStorage = loadFromLocalStorage;
window.generateTvLink = generateTvLink;
