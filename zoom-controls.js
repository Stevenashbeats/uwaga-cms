// Interaktywne kontrolki zoom i pan dla podglądu
let currentZoom = 0.45;
let panX = 0;
let panY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;

function initZoomControls() {
  const previewArea = document.querySelector('.preview-area');
  const tvScreen = document.querySelector('.tv-screen');
  
  if (!previewArea || !tvScreen) return;
  
  // Wyśrodkuj na start
  centerPreview();
  
  // Zoom za pomocą scroll (Ctrl/Cmd + scroll lub pinch)
  previewArea.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      currentZoom = Math.max(0.1, Math.min(2, currentZoom + delta));
      
      updateTransform();
    }
  }, { passive: false });
  
  // Drag do przesuwania (jak magic mouse)
  previewArea.addEventListener('mousedown', (e) => {
    // Tylko jeśli nie kliknięto w edytor
    if (e.target.closest('.editor-sidebar')) return;
    
    isDragging = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
    previewArea.style.cursor = 'grabbing';
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    updateTransform();
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      previewArea.style.cursor = 'grab';
    }
  });
  
  // Dodaj cursor grab
  previewArea.style.cursor = 'grab';
  
  // Reset na double click
  previewArea.addEventListener('dblclick', (e) => {
    if (e.target.closest('.editor-sidebar')) return;
    centerPreview();
  });
}

function updateTransform() {
  const tvScreen = document.querySelector('.tv-screen');
  if (!tvScreen) return;
  
  tvScreen.style.transform = `translate(${panX}px, ${panY}px) scale(${currentZoom})`;
  tvScreen.style.transition = 'none';
}

function centerPreview() {
  const previewArea = document.querySelector('.preview-area');
  const tvScreen = document.querySelector('.tv-screen');
  
  if (!previewArea || !tvScreen) return;
  
  // Reset pozycji
  panX = 0;
  panY = 0;
  
  // Oblicz zoom, żeby zmieścić w oknie
  const areaWidth = previewArea.clientWidth;
  const areaHeight = previewArea.clientHeight;
  const screenWidth = 1080;
  const screenHeight = 1920;
  
  const zoomX = (areaWidth - 40) / screenWidth;
  const zoomY = (areaHeight - 40) / screenHeight;
  currentZoom = Math.min(zoomX, zoomY, 1);
  
  tvScreen.style.transition = 'transform 0.3s ease';
  updateTransform();
  
  setTimeout(() => {
    tvScreen.style.transition = 'none';
  }, 300);
}

// Dodaj kontrolki UI
function addZoomUI() {
  const previewArea = document.querySelector('.preview-area');
  if (!previewArea) return;
  
  const controls = document.createElement('div');
  controls.className = 'zoom-controls';
  controls.innerHTML = `
    <button class="zoom-btn" id="zoom-in" title="Zoom in (Ctrl/Cmd + Scroll)">+</button>
    <button class="zoom-btn" id="zoom-out" title="Zoom out (Ctrl/Cmd + Scroll)">−</button>
    <button class="zoom-btn" id="zoom-reset" title="Reset (Double click)">⟲</button>
    <span class="zoom-level">${Math.round(currentZoom * 100)}%</span>
  `;
  
  previewArea.appendChild(controls);
  
  // Obsługa przycisków
  document.getElementById('zoom-in').addEventListener('click', () => {
    currentZoom = Math.min(2, currentZoom + 0.1);
    updateTransform();
    updateZoomLevel();
  });
  
  document.getElementById('zoom-out').addEventListener('click', () => {
    currentZoom = Math.max(0.1, currentZoom - 0.1);
    updateTransform();
    updateZoomLevel();
  });
  
  document.getElementById('zoom-reset').addEventListener('click', () => {
    centerPreview();
    updateZoomLevel();
  });
}

function updateZoomLevel() {
  const zoomLevel = document.querySelector('.zoom-level');
  if (zoomLevel) {
    zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
  }
}

// Inicjalizacja
window.addEventListener('DOMContentLoaded', () => {
  // Tylko w trybie edytora (nie TV)
  if (!document.body.classList.contains('tv-mode')) {
    initZoomControls();
    addZoomUI();
  }
});

// Re-center przy resize okna
window.addEventListener('resize', () => {
  if (!document.body.classList.contains('tv-mode')) {
    centerPreview();
    updateZoomLevel();
  }
});
