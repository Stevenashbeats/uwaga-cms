// Automatyczne skalowanie zawartości do 1080x1920px
let currentScale = 1;
let isScaling = false;

function autoScaleContent() {
  // Sprawdź czy jesteśmy w trybie TV lub edytorze z podglądem
  const urlParams = new URLSearchParams(window.location.search);
  const isTVMode = urlParams.has('tv');
  const isEditor = !isTVMode; // Jeśli nie TV, to edytor
  
  // Autoscale działa WSZĘDZIE (TV i edytor)
  console.log(`🎯 Autoscale: tryb=${isTVMode ? 'TV' : 'Edytor'}`);
  
  const menuPreview = document.getElementById('menu-preview');
  const menuContainer = document.querySelector('.tv-screen .menu-container');
  
  if (!menuPreview || !menuContainer) {
    console.log('⏭️ Autoscale: pomijam - brak elementów');
    return;
  }
  
  if (isScaling) {
    console.log('⏭️ Autoscale: pomijam - już skaluje');
    return;
  }
  
  isScaling = true;
  
  // Użyj requestAnimationFrame dla płynności
  requestAnimationFrame(() => {
    const containerHeight = 1920; // Pełna wysokość kontenera
    const paddingTop = 60; // padding górny
    const paddingBottom = 60; // padding dolny
    const safetyMargin = 80; // dodatkowy margines bezpieczeństwa (zwiększony)
    
    // Dostępna wysokość z marginesami
    const availableHeight = containerHeight - paddingTop - paddingBottom - safetyMargin;
    
    // Pobierz rzeczywistą wysokość zawartości BEZ resetowania transform
    // Jeśli jest już skalowane, podziel przez currentScale aby dostać oryginalną wysokość
    let contentHeight = Math.max(
      menuPreview.scrollHeight,
      menuPreview.offsetHeight,
      menuPreview.getBoundingClientRect().height
    );
    
    // Jeśli jest już skalowane, oblicz oryginalną wysokość
    if (currentScale !== 1 && currentScale > 0) {
      contentHeight = contentHeight / currentScale;
    }
    
    console.log(`📏 Autoscale: available=${availableHeight}px, content=${contentHeight}px (currentScale=${currentScale})`);
    
    let newScale = 1;
      
    // ZAWSZE skaluj jeśli zawartość jest większa niż dostępna wysokość
    if (contentHeight > availableHeight) {
      // Oblicz skalę aby zmieścić zawartość
      newScale = availableHeight / contentHeight;
      // Dodatkowe zmniejszenie o 5% dla pewności (zwiększone z 2%)
      newScale = newScale * 0.95;
      console.log(`🔽 Skalowanie do ${Math.round(newScale * 100)}% (${contentHeight}px → ${Math.round(contentHeight * newScale)}px)`);
    } else {
      console.log(`✅ Zawartość mieści się bez skalowania`);
    }
    
    // Zastosuj skalę tylko jeśli się zmieniła (unikaj niepotrzebnych rerenderów)
    if (Math.abs(newScale - currentScale) > 0.001) {
      currentScale = newScale;
      menuPreview.style.transformOrigin = 'top center';
      menuPreview.style.transform = `scale(${newScale})`;
      console.log(`✨ Zastosowano transform: scale(${newScale})`);
      
      if (newScale < 1) {
        // Ustaw wysokość i ujemny margin aby zawartość nie wychodziła poza
        const scaledHeight = contentHeight * newScale;
        menuPreview.style.height = `${contentHeight}px`;
        menuPreview.style.marginBottom = `-${(contentHeight - scaledHeight)}px`;
        console.log(`📐 Ustawiono height=${contentHeight}px, marginBottom=-${Math.round(contentHeight - scaledHeight)}px`);
      } else {
        menuPreview.style.height = 'auto';
        menuPreview.style.marginBottom = '0';
      }
    } else {
      console.log(`⏭️ Pomijam - skala się nie zmieniła`);
    }
    
    isScaling = false;
  });
}

// Uruchom autoscale po każdej zmianie - WSZĘDZIE (TV i edytor)
const originalRenderPreview = window.renderPreview;
if (originalRenderPreview) {
  window.renderPreview = function() {
    originalRenderPreview();
    // Autoscale zawsze po renderze
    setTimeout(autoScaleContent, 100);
  };
}

// Uruchom przy załadowaniu
window.addEventListener('load', () => {
  // Opóźnienie aby DOM się wyrenderował
  setTimeout(autoScaleContent, 100);
  setTimeout(autoScaleContent, 500);
});
window.addEventListener('resize', autoScaleContent);

// Dodaj MutationObserver aby wykrywać zmiany w DOM - WSZĘDZIE
const observer = new MutationObserver(() => {
  // Autoscale przy każdej zmianie DOM
  setTimeout(autoScaleContent, 100);
});

// Obserwuj zmiany w menu-preview
const menuPreview = document.getElementById('menu-preview');
if (menuPreview) {
  observer.observe(menuPreview, { 
    childList: true, 
    subtree: true,
    characterData: true 
  });
}
