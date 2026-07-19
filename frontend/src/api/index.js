import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios Instance
export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach admin JWT token if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Centralized API calls
export const contentApi = {
  getContent: async () => {
    const response = await api.get('/content');
    return response.data;
  },
  updateContent: async (data) => {
    const response = await api.put('/content', data);
    return response.data;
  },
};

export const authApi = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

export const adminApi = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
};

export const stripeApi = {
  getConfig: async () => {
    const response = await api.get('/stripe/config');
    return response.data;
  },
};

export const donationApi = {
  createPaymentIntent: async (orderPayload) => {
    const response = await api.post('/donations/create-payment-intent', orderPayload);
    return response.data;
  },
  confirmDonation: async (payload) => {
    const response = await api.post('/donations/confirm', payload);
    return response.data;
  },
};
