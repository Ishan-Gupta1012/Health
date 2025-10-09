import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('healthnest_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('healthnest_token');
      localStorage.removeItem('healthnest_user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// API functions
export const apiService = {
  // Health check
  checkHealth: () => api.get('/health'),

  // Auth APIs
  auth: {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
  },

  // Symptoms APIs
  symptoms: {
    check: (data) => api.post('/symptoms/check', data),
    getAvailable: () => api.get('/symptoms/available'),
    getEmergency: () => api.get('/symptoms/emergency'),
  },

  // Doctors APIs
  doctors: {
    getAll: (params) => api.get('/doctors', { params }),
    search: (params) => api.get('/doctors/search', { params }),
    getById: (doctorId) => api.get(`/doctors/${doctorId}`),
    getSpecialties: () => api.get('/doctors/data/specialties'),
    seed: () => api.post('/doctors/seed'),
  },

  // Reminders APIs
  reminders: {
    getAll: (params) => api.get('/reminders', { params }),
    create: (data) => api.post('/reminders', data),
    getById: (reminderId) => api.get(`/reminders/${reminderId}`),
    update: (reminderId, data) => api.put(`/reminders/${reminderId}`, data),
    delete: (reminderId) => api.delete(`/reminders/${reminderId}`),
    markDose: (reminderId, data) => api.post(`/reminders/${reminderId}/dose`, data),
    getStats: () => api.get('/reminders/stats/overview'),
  },

  // Medical Records APIs
  records: {
    getAll: (params) => api.get('/records', { params }),
    create: (formData) => api.post('/records', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getById: (recordId) => api.get(`/records/${recordId}`),
    update: (recordId, formData) => api.put(`/records/${recordId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (recordId) => api.delete(`/records/${recordId}`),
    deleteFile: (recordId, filename) => api.delete(`/records/${recordId}/files/${filename}`),
    share: (recordId, data) => api.post(`/records/${recordId}/share`, data),
    getTypes: () => api.get('/records/data/types'),
  },
};

// Convenience function for health check
export const checkBackendHealth = async () => {
  try {
    const response = await apiService.checkHealth();
    return response.data;
  } catch (error) {
    throw new Error(`Backend health check failed: ${error.message}`);
  }
};

export default api;