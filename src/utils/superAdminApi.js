// src/utils/superAdminApi.js

const API_BASE_URL = 'http://localhost:4000/api';

/**
 * Helper function for authenticated super admin API calls
 * @param {string} endpoint - API endpoint (e.g., '/super-admin/products')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise} - Response data
 */
export const superAdminApiCall = async (endpoint, options = {}) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('superAdminToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Prepare headers
    const headers = {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    // Only add Content-Type if not already set and body is not FormData
    if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // Make the API call
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle different response types
    const contentType = response.headers.get('content-type');
    
    // If response is not ok, try to parse error
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If parsing fails, use default error message
      }
      
      // Handle 401 - Unauthorized
      if (response.status === 401) {
        localStorage.removeItem('superAdminToken');
        localStorage.removeItem('superAdminUser');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
      
      throw new Error(errorMessage);
    }

    // Handle different content types
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else if (contentType && contentType.includes('text/csv')) {
      return await response.text();
    } else if (contentType && contentType.includes('blob')) {
      return await response.blob();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

/**
 * Helper function for file uploads
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - FormData object with files
 * @returns {Promise} - Response data
 */
export const superAdminFileUpload = async (endpoint, formData) => {
  try {
    const token = localStorage.getItem('superAdminToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Upload failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('File Upload Error:', error);
    throw error;
  }
};

export default superAdminApiCall;