// Zarządzanie linkami dla telewizorów

// Funkcja do generowania linków dla wszystkich TV
function generateTVLinks() {
  if (!window.appState || !window.appState.tvs) {
    console.log('⏳ Czekam na załadowanie appState...');
    return;
  }

  const baseUrl = window.location.origin + window.location.pathname;
  const tvs = Object.values(window.appState.tvs);
  
  console.log('📺 Generuję linki dla TV:', tvs);

  // Aktualizuj linki dla każdego TV
  tvs.forEach((tv, index) => {
    const linkInput = document.getElementById(`tv${index + 1}-link`);
    const copyBtn = document.getElementById(`copy-tv${index + 1}-btn`);
    const tvLinkGroups = document.querySelectorAll('.tv-link-group');
    const label = tvLinkGroups[index]?.querySelector('label');
    
    if (linkInput) {
      // Link bez tokenu - TV będzie publiczny dla danego venue
      const url = `${baseUrl}?tv=1&tvid=${tv.id}`;
      linkInput.value = url;
      console.log(`✅ Link dla ${tv.name}:`, url);
    } else {
      console.error(`❌ Nie znaleziono inputa tv${index + 1}-link`);
    }
    
    if (label) {
      label.textContent = `📺 ${tv.name}`;
    } else {
      console.error(`❌ Nie znaleziono labela dla TV ${index + 1}`);
    }
    
    if (copyBtn && linkInput) {
      // Usuń stare listenery
      const newBtn = copyBtn.cloneNode(true);
      copyBtn.parentNode.replaceChild(newBtn, copyBtn);
      
      newBtn.addEventListener('click', () => {
        linkInput.select();
        document.execCommand('copy');
        newBtn.textContent = '✓';
        setTimeout(() => {
          newBtn.textContent = '📋';
        }, 2000);
      });
    }
  });
}

// Eksportuj globalnie
window.generateTVLinks = generateTVLinks;
