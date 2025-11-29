// System autentykacji z API
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
  ? 'http://localhost:8787/api'
  : 'https://uwaga-kawa-cms.nashpillow.workers.dev/api';

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.userData = null;
    this.token = null;
    this.init();
  }

  init() {
    // Sprawdź czy użytkownik jest zalogowany
    const savedUser = sessionStorage.getItem('currentUser');
    const savedToken = sessionStorage.getItem('auth_token');
    const savedUserData = sessionStorage.getItem('userData');
    
    if (savedUser && savedToken && savedUserData) {
      this.currentUser = savedUser;
      this.token = savedToken;
      this.userData = JSON.parse(savedUserData);
    }
  }

  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.error || 'Błąd logowania' };
      }

      // Zapisz dane użytkownika
      this.currentUser = username;
      this.token = data.token;
      this.userData = data.user;
      
      sessionStorage.setItem('currentUser', username);
      sessionStorage.setItem('auth_token', data.token);
      sessionStorage.setItem('userData', JSON.stringify(data.user));
      
      return { success: true, user: username };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Błąd połączenia z serwerem' };
    }
  }

  logout() {
    this.currentUser = null;
    this.token = null;
    this.userData = null;
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('userData');
    window.location.reload();
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getUserData() {
    return this.userData;
  }

  getToken() {
    return this.token;
  }

  getDisplayName() {
    return this.userData ? this.userData.venueName : '';
  }

  getTheme() {
    return this.userData ? this.userData.theme : 'kawa';
  }

  getVenueId() {
    return this.userData ? this.userData.venueId : null;
  }

  // Helper do robienia requestów z autoryzacją
  async apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Pobierz token z this.token lub sessionStorage (dla trybu TV)
    const token = this.token || sessionStorage.getItem('auth_token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }

  // Klucz localStorage specyficzny dla użytkownika
  getUserStorageKey(key) {
    return `${this.currentUser}_${key}`;
  }
}

// Globalna instancja
const authManager = new AuthManager();
window.authManager = authManager; // Eksportuj globalnie

// Funkcja do pokazania/ukrycia panelu logowania
function showLoginPanel() {
  document.getElementById('login-panel').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
}

function hideLoginPanel() {
  document.getElementById('login-panel').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
}

// Obsługa formularza logowania
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const logoutBtn = document.getElementById('logout-btn');

  // Sprawdź czy jesteśmy w trybie TV (bez logowania)
  const urlParams = new URLSearchParams(window.location.search);
  const isTVMode = urlParams.has('tv');

  if (isTVMode) {
    // Tryb TV - nie wymagaj logowania
    hideLoginPanel();
    return;
  }

  // Sprawdź czy użytkownik jest zalogowany
  if (!authManager.isLoggedIn()) {
    showLoginPanel();
  } else {
    hideLoginPanel();
    updateUIForUser();
  }

  // Obsługa logowania
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;

      // Pokaż loading
      loginError.textContent = 'Logowanie...';
      loginError.style.display = 'block';
      loginError.style.color = '#666';

      const result = await authManager.login(username, password);

      if (result.success) {
        loginError.style.display = 'none';
        hideLoginPanel();
        updateUIForUser();
        // Przeładuj aplikację z danymi użytkownika
        if (window.loadUserData) {
          await window.loadUserData();
        }
      } else {
        loginError.textContent = result.message;
        loginError.style.display = 'block';
        loginError.style.color = '#e74c3c';
      }
    });
  }

  // Obsługa wylogowania
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Czy na pewno chcesz się wylogować?')) {
        authManager.logout();
      }
    });
  }
});

// Aktualizacja UI dla zalogowanego użytkownika
function updateUIForUser() {
  const displayName = authManager.getDisplayName();
  const userNameElement = document.getElementById('user-display-name');
  
  if (userNameElement) {
    userNameElement.textContent = displayName;
  }

  // Ustaw theme
  const theme = authManager.getTheme();
  document.body.setAttribute('data-theme', theme);

  // Pokaż przycisk wylogowania
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.style.display = 'block';
  }
}
