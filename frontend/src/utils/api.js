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

// --- API Service Definitions ---

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
      const response = await api.post('/reminders', data, { headers: getAuthHeaders() });
      return response.data;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },
  getReminders: async () => {
    try {
      const response = await api.get('/reminders', { headers: getAuthHeaders() });
      return response.data;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },
  deleteReminder: async (reminderId) => {
    try {
      const response = await api.delete(`/reminders/${reminderId}`, { headers: getAuthHeaders() });
      return response.data;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }
};

// 🩺 Medical Records API methods
export const records = {
  createRecord: async (formData) => {
    try {
      const response = await api.post('/records', formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },
  getRecords: async () => {
    try {
      const response = await api.get('/records', { headers: getAuthHeaders() });
      return response.data;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },
  deleteRecord: async (recordId) => {
    try {
      const response = await api.delete(`/records/${recordId}`, { headers: getAuthHeaders() });
      return response.data;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }
};

// 🍽️ Meals API methods
export const meals = {
    addMeal: async (mealData) => {
        try {
            const response = await api.post('/meals', mealData, { headers: getAuthHeaders() });
            return response.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
    getTodaysMeals: async () => {
        try {
            const response = await api.get('/meals/today', { headers: getAuthHeaders() });
            return response.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
    getMealHistory: async () => {
        try {
            const response = await api.get('/meals/history', { headers: getAuthHeaders() });
            return response.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
    updateMeal: async (id, mealData) => {
        try {
            const response = await api.put(`/meals/${id}`, mealData, { headers: getAuthHeaders() });
            return response.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
    deleteMeal: async (id) => {
        try {
            const response = await api.delete(`/meals/${id}`, { headers: getAuthHeaders() });
            return response.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
    getAIAdvice: async () => {
        try {
            const response = await api.get('/meals/advice', { headers: getAuthHeaders() });
            return response.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    }
};

// 👨‍⚕️ Doctors API methods
export const doctors = {
  find: async (specialty, location) => {
    try {
      const encodedSpecialty = encodeURIComponent(specialty);
      const encodedLocation = encodeURIComponent(location);
      const response = await api.get(`/doctors?specialty=${encodedSpecialty}&location=${encodedLocation}`);
      return response.data;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }
};

// 🤖 Chatbot API methods
export const chatbot = {
    getGeminiReply: async (data) => {
        try {
            const response = await api.post('/chatbot/gemini', data, { headers: getAuthHeaders() });
            return response.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
    analyzeMeal: async (data) => {
        try {
            const response = await api.post('/chatbot/meal', data, { headers: getAuthHeaders() });
            return response.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    }
};

// 🧩 Centralized API service (FIXED: `chatbot` is now correctly included)
export const apiService = { auth, reminders, records, meals, doctors, chatbot };

export default apiService;
