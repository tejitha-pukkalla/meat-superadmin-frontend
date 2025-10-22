import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

// Create axios instance for multipart/form-data (file uploads)
const categoryAxios = axios.create({
  baseURL: API_BASE_URL,
});

// Create separate axios instance for regular JSON requests
const jsonAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to multipart requests
categoryAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('superAdminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Set multipart/form-data only for POST/PUT requests
    if (config.method === 'post' || config.method === 'put') {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add token to JSON requests
jsonAxios.interceptors.request.use(
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

// Handle response errors for both instances
const handleResponseError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('superAdminToken');
    localStorage.removeItem('superAdminUser');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

categoryAxios.interceptors.response.use(
  (response) => response,
  handleResponseError
);

jsonAxios.interceptors.response.use(
  (response) => response,
  handleResponseError
);

// Category APIs
export const categoryAPI = {
  // Get all categories (use JSON axios)
  getAllCategories: (params) => jsonAxios.get('/category', { params }),
  
  // Get single category (use JSON axios)
  getCategoryById: (id) => jsonAxios.get(`/category/${id}`),
  
  // Create category (use multipart axios)
  createCategory: (formData) => categoryAxios.post('/category', formData),
  
  // Update category (use multipart axios)
  updateCategory: (id, formData) => categoryAxios.put(`/category/${id}`, formData),
  
  // Delete category (use JSON axios)
  deleteCategory: (id, hardDelete = false) => 
    jsonAxios.delete(`/category/${id}?hard_delete=${hardDelete}`),
  
  // Bulk update status (use JSON axios)
  bulkUpdateStatus: (data) => jsonAxios.post('/category/bulk-update-status', data),
  
  // Reorder categories (use JSON axios)
  reorderCategories: (data) => jsonAxios.post('/category/reorder', data),
};

// Subcategory APIs
export const subcategoryAPI = {
  // Get all subcategories (use JSON axios)
  getAllSubcategories: (params) => jsonAxios.get('/subcategories', { params }),
  
  // Get single subcategory (use JSON axios)
  getSubcategoryById: (id) => jsonAxios.get(`/subcategories/${id}`),
  
  // Create subcategory (use multipart axios)
  createSubcategory: (formData) => categoryAxios.post('/subcategories', formData),
  
  // Update subcategory (use multipart axios)
  updateSubcategory: (id, formData) => categoryAxios.put(`/subcategories/${id}`, formData),
  
  // Delete subcategory (use JSON axios)
  deleteSubcategory: (id, hardDelete = false) => 
    jsonAxios.delete(`/subcategories/${id}?hard_delete=${hardDelete}`),
  
  // Bulk update status (use JSON axios)
  bulkUpdateStatus: (data) => jsonAxios.post('/subcategories/bulk-update-status', data),
};

// Public Category APIs (use JSON axios - no auth required)
export const publicCategoryAPI = {
  getActiveCategories: () => jsonAxios.get('/public/categories'),
  getActiveSubcategories: (categoryId) => 
    jsonAxios.get(`/public/subcategories/${categoryId}`),
  getAllActiveSubcategories: () => jsonAxios.get('/public/subcategories'),
};