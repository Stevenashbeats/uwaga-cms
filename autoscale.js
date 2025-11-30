// Automatyczne skalowanie zawartości do 1080x1920px
let currentScale = 1;
let isScaling = false;

function autoScaleContent() {
  // Sprawdź czy jesteśmy w trybie TV
  const urlParams = new URLSearchParams(window.location.search);
  const isTVMode = urlParams.has('tv');
  
  // Autoscale działa TYLKO na TV (nie w edytorze)
  if (!isTVMode) {
    return;
  }
  
  console.log(`🎯 Autoscale START: tryb=TV, timestamp=${Date.now()}`);
  
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
  
  // Reset transform przed pomiarem
  menuPreview.style.transform = 'scale(1)';
  menuPreview.style.transformOrigin = 'top center';
  
  // Poczekaj na render
  setTimeout(() => {
    // Wysokość kontenera (720x1280)
    const containerHeight = 1280;
    const containerWidth = 720;
    
    // Rzeczywista wysokość zawartości
    const contentHeight = menuPreview.scrollHeight;
    const contentWidth = menuPreview.scrollWidth;
    
    console.log(`📏 Container: ${containerWidth}x${containerHeight}px`);
    console.log(`📏 Content: ${contentWidth}x${contentHeight}px`);
    
    // Oblicz skalę aby zmieścić zawartość
    const scaleY = containerHeight / contentHeight;
    const scaleX = containerWidth / contentWidth;
    const scale = Math.min(scaleY, scaleX, 1); // Nie powiększaj, tylko zmniejszaj
    
    console.log(`📊 Scale Y: ${scaleY.toFixed(3)}, Scale X: ${scaleX.toFixed(3)}`);
    console.log(`🎯 Final scale: ${scale.toFixed(3)}`);
    
    if (scale < 1) {
      menuPreview.style.transform = `scale(${scale})`;
      menuPreview.style.transformOrigin = 'top center';
      currentScale = scale;
      console.log(`✅ Autoscale zastosowany: ${(scale * 100).toFixed(1)}%`);
    } else {
      menuPreview.style.transform = 'scale(1)';
      currentScale = 1;
      console.log(`✅ Autoscale: zawartość mieści się (100%)`);
    }
    
    isScaling = false;
  }, 50);
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
const menuPreviewElement = document.getElementById('menu-preview');
if (menuPreviewElement) {
  observer.observe(menuPreviewElement, { 
    childList: true, 
    subtree: true,
    characterData: true 
  });
}
