import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('superAdminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('superAdminToken');
      localStorage.removeItem('superAdminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/super-admin/login', credentials),
  getProfile: () => api.get('/super-admin/profile'),
  updateProfile: (data) => api.put('/super-admin/profile', data),
  changePassword: (data) => api.put('/super-admin/change-password', data),
};

// Vendor APIs
export const vendorAPI = {
  createVendor: (data) => api.post('/super-admin/vendors', data),
  getAllVendors: (params) => api.get('/super-admin/vendors', { params }),
  getVendorById: (id) => api.get(`/super-admin/vendors/${id}`),
  updateVendor: (id, data) => api.put(`/super-admin/vendors/${id}`, data),
  deleteVendor: (id) => api.delete(`/super-admin/vendors/${id}`),
  updateVendorStatus: (id, status) => api.put(`/super-admin/vendors/${id}/status`, { status }),
  approveDocuments: (id) => api.put(`/super-admin/vendors/${id}/approve-documents`),
  verifyBanking: (id) => api.put(`/super-admin/vendors/${id}/verify-banking`),
};

// Commission APIs
export const commissionAPI = {
  getSettings: () => api.get('/super-admin/commission-settings'),
  updateSettings: (data) => api.put('/super-admin/commission-settings', data),
};

// ============================================
// NEW: Category & Subcategory APIs
// ============================================

// Create separate axios instance for multipart/form-data (file uploads)
const categoryApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Add token to category API requests
categoryApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('superAdminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors for category API
categoryApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('superAdminToken');
      localStorage.removeItem('superAdminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Category APIs
export const categoryAPI = {
  // Get all categories
  getAllCategories: (params) => categoryApi.get('/category', { params }),
  
  // Get single category
  getCategoryById: (id) => categoryApi.get(`/category/${id}`),
  
  // Create category
  createCategory: (formData) => categoryApi.post('/category', formData),
  
  // Update category
  updateCategory: (id, formData) => categoryApi.put(`/category/${id}`, formData),
  
  // Delete category
  deleteCategory: (id, hardDelete = false) => 
    categoryApi.delete(`/category/${id}?hard_delete=${hardDelete}`),
  
  // Bulk update status
  bulkUpdateStatus: (data) => categoryApi.post('/category/bulk-update-status', data),
  
  // Reorder categories
  reorderCategories: (data) => categoryApi.post('/category/reorder', data),
};

// Subcategory APIs
export const subcategoryAPI = {
  // Get all subcategories
  getAllSubcategories: (params) => categoryApi.get('/subcategories', { params }),
  
  // Get single subcategory
  getSubcategoryById: (id) => categoryApi.get(`/subcategories/${id}`),
  
  // Create subcategory
  createSubcategory: (formData) => categoryApi.post('/subcategories', formData),
  
  // Update subcategory
  updateSubcategory: (id, formData) => categoryApi.put(`/subcategories/${id}`, formData),
  
  // Delete subcategory
  deleteSubcategory: (id, hardDelete = false) => 
    categoryApi.delete(`/subcategories/${id}?hard_delete=${hardDelete}`),
  
  // Bulk update status
  bulkUpdateStatus: (data) => categoryApi.post('/subcategories/bulk-update-status', data),
};

// Public Category APIs (for fetching active categories without auth restrictions)
export const publicCategoryAPI = {
  getActiveCategories: () => api.get('/public/categories'),
  getActiveSubcategories: (categoryId) => 
    api.get(`/public/subcategories/${categoryId}`),
  getAllActiveSubcategories: () => api.get('/public/subcategories'),
};

export default api;