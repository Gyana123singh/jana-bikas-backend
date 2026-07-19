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
  getPublicSupporters: async () => {
    const response = await api.get('/donations/public/supporters');
    return response.data;
  },
  getDonationById: async (id) => {
    const response = await api.get(`/donations/${id}`);
    return response.data;
  },
  searchDonations: async (payload) => {
    const response = await api.post('/donations/public/search', payload);
    return response.data;
  },
  createOfflineDonation: async (payload) => {
    const response = await api.post('/donations/offline', payload);
    return response.data;
  },
  submitOfflineReference: async (payload) => {
    const response = await api.post('/donations/offline/confirm-ref', payload);
    return response.data;
  },
  getDonationsAdmin: async (params) => {
    const response = await api.get('/donations', { params });
    return response.data;
  },
  updateDonationAdmin: async (id, payload) => {
    const response = await api.put(`/donations/${id}`, payload);
    return response.data;
  },
};

export const causesApi = {
  getCauses: async () => {
    const response = await api.get('/causes');
    return response.data;
  },
  getCauseBySlug: async (slug) => {
    const response = await api.get(`/causes/${slug}`);
    return response.data;
  },
  getAllCausesAdmin: async () => {
    const response = await api.get('/causes/admin/all');
    return response.data;
  },
  createCauseAdmin: async (data) => {
    const response = await api.post('/causes/admin', data);
    return response.data;
  },
  updateCauseAdmin: async (id, data) => {
    const response = await api.put(`/causes/admin/${id}`, data);
    return response.data;
  },
  deleteCauseAdmin: async (id) => {
    const response = await api.delete(`/causes/admin/${id}`);
    return response.data;
  },
};

export const galleryApi = {
  getItems: async (type) => {
    const response = await api.get('/gallery', { params: { type } });
    return response.data;
  },
  getAllItemsAdmin: async () => {
    const response = await api.get('/gallery/admin/all');
    return response.data;
  },
  createItemAdmin: async (data) => {
    const response = await api.post('/gallery/admin', data);
    return response.data;
  },
  updateItemAdmin: async (id, data) => {
    const response = await api.put(`/gallery/admin/${id}`, data);
    return response.data;
  },
  deleteItemAdmin: async (id) => {
    const response = await api.delete(`/gallery/admin/${id}`);
    return response.data;
  },
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const storiesApi = {
  getStories: async () => {
    const response = await api.get('/success-stories');
    return response.data;
  },
  getStoryBySlug: async (slug) => {
    const response = await api.get(`/success-stories/${slug}`);
    return response.data;
  },
  getAllStoriesAdmin: async () => {
    const response = await api.get('/success-stories/admin/all');
    return response.data;
  },
  createStoryAdmin: async (data) => {
    const response = await api.post('/success-stories/admin', data);
    return response.data;
  },
  updateStoryAdmin: async (id, data) => {
    const response = await api.put(`/success-stories/admin/${id}`, data);
    return response.data;
  },
  deleteStoryAdmin: async (id) => {
    const response = await api.delete(`/success-stories/admin/${id}`);
    return response.data;
  },
};

export const socialApi = {
  getPlatforms: async () => {
    const response = await api.get('/social/platforms');
    return response.data;
  },
  trackClick: async (id) => {
    const response = await api.post(`/social/platforms/${id}/click`);
    return response.data;
  },
  getPosts: async () => {
    const response = await api.get('/social/posts');
    return response.data;
  },
  likePost: async (id) => {
    const response = await api.post(`/social/posts/${id}/like`);
    return response.data;
  },
  commentPost: async (id, data) => {
    const response = await api.post(`/social/posts/${id}/comment`, data);
    return response.data;
  },
  sharePost: async (id) => {
    const response = await api.post(`/social/posts/${id}/share`);
    return response.data;
  },
  getAnalytics: async () => {
    const response = await api.get('/social/admin/analytics');
    return response.data;
  },
  
  // Platform Admin CRUD
  getAllPlatformsAdmin: async () => {
    const response = await api.get('/social/platforms/admin/all');
    return response.data;
  },
  createPlatformAdmin: async (data) => {
    const response = await api.post('/social/platforms/admin', data);
    return response.data;
  },
  updatePlatformAdmin: async (id, data) => {
    const response = await api.put(`/social/platforms/admin/${id}`, data);
    return response.data;
  },
  deletePlatformAdmin: async (id) => {
    const response = await api.delete(`/social/platforms/admin/${id}`);
    return response.data;
  },

  // Post Admin CRUD
  getAllPostsAdmin: async () => {
    const response = await api.get('/social/posts/admin/all');
    return response.data;
  },
  createPostAdmin: async (data) => {
    const response = await api.post('/social/posts/admin', data);
    return response.data;
  },
  updatePostAdmin: async (id, data) => {
    const response = await api.put(`/social/posts/admin/${id}`, data);
    return response.data;
  },
  deletePostAdmin: async (id) => {
    const response = await api.delete(`/social/posts/admin/${id}`);
    return response.data;
  },
};

export const volunteerApi = {
  submitVolunteer: async (data) => {
    const response = await api.post('/volunteer', data);
    return response.data;
  },
  getVolunteersAdmin: async () => {
    const response = await api.get('/volunteer/admin');
    return response.data;
  },
  updateVolunteerAdmin: async (id, status) => {
    const response = await api.put(`/volunteer/admin/${id}`, { status });
    return response.data;
  },
  deleteVolunteerAdmin: async (id) => {
    const response = await api.delete(`/volunteer/admin/${id}`);
    return response.data;
  },
};

export const contactApi = {
  submitContact: async (data) => {
    const response = await api.post('/contact', data);
    return response.data;
  },
  getContactsAdmin: async () => {
    const response = await api.get('/contact/admin');
    return response.data;
  },
  updateContactAdmin: async (id) => {
    const response = await api.put(`/contact/admin/${id}`);
    return response.data;
  },
  deleteContactAdmin: async (id) => {
    const response = await api.delete(`/contact/admin/${id}`);
    return response.data;
  },
};

