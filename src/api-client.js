/**
 * API Client dla komunikacji z backendem
 */

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8787/api'
  : 'https://api.uwaga-kawa.com/api'; // Zmień na swoją domenę

class ApiClient {
  constructor() {
    this.token = sessionStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      sessionStorage.setItem('auth_token', token);
    } else {
      sessionStorage.removeItem('auth_token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth
  async login(username, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    this.setToken(data.token);
    return data;
  }

  logout() {
    this.setToken(null);
  }

  // TVs
  async getTvs() {
    return this.request('/tvs');
  }

  async getTv(id) {
    return this.request(`/tvs/${id}`);
  }

  async createTv(data) {
    return this.request('/tvs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTv(id, data) {
    return this.request(`/tvs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTv(id) {
    return this.request(`/tvs/${id}`, {
      method: 'DELETE',
    });
  }

  // Sections
  async createSection(tvId, data) {
    return this.request(`/tvs/${tvId}/sections`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSection(id, data) {
    return this.request(`/sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSection(id) {
    return this.request(`/sections/${id}`, {
      method: 'DELETE',
    });
  }

  // Items
  async createItem(sectionId, data) {
    return this.request(`/sections/${sectionId}/items`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateItem(id, data) {
    return this.request(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteItem(id) {
    return this.request(`/items/${id}`, {
      method: 'DELETE',
    });
  }

  // TV Links
  async createTvLink(tvId) {
    return this.request(`/tvs/${tvId}/link`, {
      method: 'POST',
    });
  }

  async getTvByToken(token) {
    return this.request(`/tv/${token}`);
  }

  // Upload
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${API_BASE_URL}/upload`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    return data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
