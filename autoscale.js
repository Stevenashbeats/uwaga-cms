// Automatyczne skalowanie zawartości do 1080x1920px
let currentScale = 1;
let isScaling = false;

function autoScaleContent() {
  // Sprawdź czy jesteśmy w trybie TV lub edytorze z podglądem
  const urlParams = new URLSearchParams(window.location.search);
  const isTVMode = urlParams.has('tv');
  const isEditor = !isTVMode; // Jeśli nie TV, to edytor
  
  // Autoscale działa WSZĘDZIE (TV i edytor)
  console.log(`🎯 Autoscale START: tryb=${isTVMode ? 'TV' : 'Edytor'}, timestamp=${Date.now()}`);
  
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
  
  // NOWA STRATEGIA: Zmniejszaj odstępy zamiast skalować
  requestAnimationFrame(() => {
    // Zmierz rzeczywistą wysokość
    const contentHeight = menuPreview.scrollHeight;
    const maxHeight = 1800; // 1920 - 60 (top) - 60 (bottom)
    
    console.log(`📏 Autoscale: maxHeight=${maxHeight}px, contentHeight=${contentHeight}px`);
    
    if (contentHeight <= maxHeight) {
      console.log(`✅ Zawartość mieści się - resetuję odstępy`);
      // Resetuj do domyślnych wartości
      menuPreview.style.setProperty('--section-margin', '48px');
      menuPreview.style.setProperty('--item-margin', '24px');
      menuPreview.style.setProperty('--section-padding', '30px 40px');
      menuPreview.style.transform = 'none';
      menuPreview.style.height = 'auto';
      menuPreview.style.marginBottom = '0';
    } else {
      // Oblicz współczynnik zmniejszenia
      const ratio = maxHeight / contentHeight;
      console.log(`🔽 Zmniejszam odstępy - ratio: ${ratio.toFixed(2)}`);
      
      // Zmniejsz marginesy proporcjonalnie
      const sectionMargin = Math.max(10, Math.round(48 * ratio));
      const itemMargin = Math.max(8, Math.round(24 * ratio));
      const sectionPadding = Math.max(15, Math.round(30 * ratio));
      
      console.log(`📐 Nowe odstępy: section=${sectionMargin}px, item=${itemMargin}px, padding=${sectionPadding}px`);
      
      menuPreview.style.setProperty('--section-margin', `${sectionMargin}px`);
      menuPreview.style.setProperty('--item-margin', `${itemMargin}px`);
      menuPreview.style.setProperty('--section-padding', `${sectionPadding}px ${sectionPadding + 10}px`);
      
      // Jeśli nadal za duże, zastosuj lekkie skalowanie
      if (ratio < 0.7) {
        const scale = 0.7 + (ratio - 0.7) * 0.5;
        menuPreview.style.transform = `scale(${scale})`;
        menuPreview.style.transformOrigin = 'top center';
        console.log(`⚠️ Dodatkowe skalowanie: ${Math.round(scale * 100)}%`);
      } else {
        menuPreview.style.transform = 'none';
      }
    }
    
    isScaling = false;
  });
}

// Uruchom autoscale po każdej zmianie - WSZĘDZIE (TV i edytor)
// Opóźnij aby window.renderPreview było zdefiniowane
setTimeout(() => {
  const originalRenderPreview = window.renderPreview;
  if (originalRenderPreview) {
    window.renderPreview = function() {
      originalRenderPreview();
      // Autoscale zawsze po renderze
      console.log('🎨 renderPreview wywołany - uruchamiam autoscale');
      setTimeout(autoScaleContent, 100);
    };
    console.log('✅ Autoscale podpięty do renderPreview');
  } else {
    console.warn('⚠️ window.renderPreview nie istnieje');
  }
}, 100);

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
