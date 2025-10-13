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

// 💊 Reminders API methods
export const reminders = {
  createReminder: async (data) => {
    try {
      return await api.post('/reminders', data, { headers: getAuthHeaders() });
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },
  getReminders: async () => {
    try {
      return await api.get('/reminders', { headers: getAuthHeaders() });
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },
  deleteReminder: async (reminderId) => {
    try {
      return await api.delete(`/reminders/${reminderId}`, { headers: getAuthHeaders() });
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }
};

// 🩺 Medical Records API methods
export const records = {
  createRecord: async (formData) => {
    try {
      return await api.post('/records', formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        }
      });
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },
  getRecords: async () => {
    try {
      return await api.get('/records', { headers: getAuthHeaders() });
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },
  deleteRecord: async (recordId) => {
    try {
      return await api.delete(`/records/${recordId}`, { headers: getAuthHeaders() });
    } catch (err) { // <-- THE MISSING BRACE IS NOW ADDED HERE
      throw new Error(getErrorMessage(err));
    }
  },

  meals: {
    addMeal: async (mealData) => {
        const res = await fetch(`${BASE_URL}/meals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(mealData),
        });
        return handleResponse(res);
    },
    getTodaysMeals: async () => {
        const res = await fetch(`${BASE_URL}/meals/today`, {
            headers: getAuthHeaders(),
        });
        const data = await handleResponse(res);
        return data.meals;
    },
    getMealHistory: async () => {
        const res = await fetch(`${BASE_URL}/meals/history`, {
            headers: getAuthHeaders(),
        });
        const data = await handleResponse(res);
        return data.meals;
    },
    updateMeal: async (id, mealData) => {
        const res = await fetch(`${BASE_URL}/meals/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(mealData),
        });
        return handleResponse(res);
    },
    deleteMeal: async (id) => {
        const res = await fetch(`${BASE_URL}/meals/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },
    getAIAdvice: async () => {
        const res = await fetch(`${BASE_URL}/meals/advice`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    }
  }
};

// 🩺 Doctors API methods
export const doctors = {
  find: async (specialty, location) => {
    try {
      // Use encodeURIComponent to handle specialties with spaces like "General Physician"
      const encodedSpecialty = encodeURIComponent(specialty);
      const encodedLocation = encodeURIComponent(location);
      return await api.get(`/doctors?specialty=${encodedSpecialty}&location=${encodedLocation}`);
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }
};


// 🧩 Centralized API service
export const apiService = { auth, reminders, records, doctors };
export default apiService;