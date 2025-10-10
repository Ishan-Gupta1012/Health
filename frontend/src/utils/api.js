import axios from 'axios';

// Base backend URL
const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Axios instance
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// Get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('healthnest_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Parse Axios errors to readable message
const getErrorMessage = (error) => {
  return error?.response?.data?.message || error?.message || 'Something went wrong';
};

// Auth APIs
export const auth = {
  login: async (data) => {
    try {
      const res = await api.post('/auth/login', data);
      return res;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },

  register: async (data) => {
    try {
      const res = await api.post('/auth/register', data);
      return res;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },

  getProfile: async () => {
    try {
      const res = await api.get('/auth/profile', { headers: getAuthHeaders() });
      return res;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },

  logout: async () => {
    try {
      const res = await api.post('/auth/logout', {}, { headers: getAuthHeaders() });
      return res;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }
};

// Export as central service
export const apiService = { auth };
export default apiService;
