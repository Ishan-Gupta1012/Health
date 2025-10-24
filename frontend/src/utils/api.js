import axios from 'axios';

// 🌐 Base backend URL (Using your definition)
const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// 🚀 Axios instance (Using your definition)
export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// 🔐 Auth header helper (Your existing helper)
export const getAuthHeaders = () => {
  const token = localStorage.getItem('healthnest_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ⚠️ Error message parser (Your existing helper)
export const getErrorMessage = (error) => {
  return error?.response?.data?.message || error?.message || 'Something went wrong';
};

// --- API Service Definitions ---

// 🔧 Auth API methods (Your existing methods)
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
  updateProfile: async (data) => {
    try {
      return await api.put('/auth/profile', data, { headers: getAuthHeaders() });
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },
  logout: async () => {
    try {
      return await api.post('/auth/logout', {}, { headers: getAuthHeaders() });
    } catch (err) {
      console.error("Logout API call failed:", getErrorMessage(err));
      return null;
    }
  }
};

// 💊 Reminders API methods (Your existing methods)
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

// 🩺 Medical Records API methods (Your existing methods)
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

// 🍽️ Meals API methods (Your existing methods)
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
    },
    getMealsByDate: async (date) => {
        try {
            const response = await api.get(`/meals/user?date=${date}`, { headers: getAuthHeaders() });
            return response.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    }
};

// 👨‍⚕️ Doctors API methods (Your existing methods)
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

// 🤖 Chatbot API methods (Your existing methods)
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

// 🩺 Symptom Checker API methods (Your existing methods)
export const symptomChecker = {
    parseSymptoms: async (text, age, sex) => {
        try {
            const response = await api.post('/symptoms/parse', { text, age, sex });
            return response.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
    getDiagnosis: async (diagnosisRequest) => {
        try {
            const response = await api.post('/symptoms/diagnose', diagnosisRequest);
            return response.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
    getHealthAdvice: async (diseaseName) => {
        try {
            const response = await api.post('/symptoms/advice', { diseaseName });
            return response.data.advice;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    }
};

// 💊 Prescription API methods (FIXED)
export const prescription = {
  analyze: async (prescriptionText) => {
    try {
      const response = await api.post('/prescription/analyze', {
        prescriptionText
      });
      return response.data.data;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }
};

// For backward compatibility, also export as standalone function
export const analyzePrescription = prescription.analyze;

// 🧩 Centralized API service (FIXED)
export const apiService = { 
  auth, 
  reminders, 
  records, 
  meals, 
  doctors, 
  chatbot, 
  symptomChecker, 
  prescription 
};

export default apiService;