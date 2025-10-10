import axios from 'axios';

// 🌐 Base backend URL
const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// 🚀 Axios instance
export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// 🔐 Auth header helper
export const getAuthHeaders = () => {
  const token = localStorage.getItem('healthnest_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ⚠️ Error message parser
export const getErrorMessage = (error) => {
  return error?.response?.data?.message || error?.message || 'Something went wrong';
};

// 🔧 Auth API methods
export const auth = {
  login: async (data) => {
    try {
      return await api.post('/auth/login', data);
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },

  register: async (data) => {
    try {
      return await api.post('/auth/register', data);
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },

  getProfile: async () => {
    try {
      return await api.get('/auth/profile', { headers: getAuthHeaders() });
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },

  logout: async () => {
    try {
      return await api.post('/auth/logout', {}, { headers: getAuthHeaders() });
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }
};

// 🧩 Centralized API service
export const apiService = { auth };
export default apiService;
