// API service that can switch between mock server and real backend
const USE_MOCK_SERVER = import.meta.env.VITE_USE_MOCK_SERVER !== 'false';
const MOCK_API_URL = import.meta.env.VITE_MOCK_API_URL || 'http://localhost:3001';
const REAL_API_URL = import.meta.env.VITE_REAL_API_URL || 'http://localhost:3000/api';

const getBaseUrl = () => {
  return USE_MOCK_SERVER ? MOCK_API_URL : REAL_API_URL;
};

// Helper for API calls
const apiCall = async (endpoint, options = {}) => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  const token = localStorage.getItem('authToken');
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Fallback to static JSON files
const fallbackFetch = async (path) => {
  try {
    const response = await fetch(`/data${path}.json`);
    if (!response.ok) throw new Error('Not found');
    return await response.json();
  } catch (error) {
    console.error(`Fallback fetch failed for ${path}:`, error);
    throw error;
  }
};

// API methods with fallback
export const api = {
  // Stores
  getStores: async () => {
    try {
      return await apiCall('/stores');
    } catch {
      return await fallbackFetch('/stores');
    }
  },

  // Books
  getBooks: async () => {
    try {
      return await apiCall('/books');
    } catch {
      return await fallbackFetch('/books');
    }
  },

  // Authors
  getAuthors: async () => {
    try {
      return await apiCall('/authors');
    } catch {
      return await fallbackFetch('/authors');
    }
  },

  // Inventory
  getInventory: async () => {
    try {
      return await apiCall('/inventory');
    } catch {
      return await fallbackFetch('/inventory');
    }
  },

  createInventoryItem: async (item) => {
    try {
      return await apiCall('/inventory', { method: 'POST', body: item });
    } catch (error) {
      throw error;
    }
  },

  updateInventoryItem: async (id, item) => {
    try {
      return await apiCall(`/inventory/${id}`, { method: 'PUT', body: item });
    } catch (error) {
      throw error;
    }
  },

  deleteInventoryItem: async (id) => {
    try {
      return await apiCall(`/inventory/${id}`, { method: 'DELETE' });
    } catch (error) {
      throw error;
    }
  },

  // Authentication
  signIn: async (credentials) => {
    return await apiCall('/auth/signin', { method: 'POST', body: credentials });
  },

  signOut: async () => {
    return await apiCall('/auth/signout', { method: 'POST' });
  },

  getCurrentUser: async () => {
    return await apiCall('/auth/me');
  },
};

export default api;

