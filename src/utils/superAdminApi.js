// // src/utils/superAdminApi.js

// const API_BASE_URL = 'http://localhost:4000/api';

// /**
//  * Helper function for authenticated super admin API calls
//  * @param {string} endpoint - API endpoint (e.g., '/super-admin/products')
//  * @param {object} options - Fetch options (method, headers, body, etc.)
//  * @returns {Promise} - Response data
//  */
// export const superAdminApiCall = async (endpoint, options = {}) => {
//   try {
//     // Get token from localStorage
//     const token = localStorage.getItem('superAdminToken');
    
//     if (!token) {
//       throw new Error('No authentication token found');
//     }

//     // Prepare headers
//     const headers = {
//       'Authorization': `Bearer ${token}`,
//       ...options.headers,
//     };

//     // Only add Content-Type if not already set and body is not FormData
//     if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
//       headers['Content-Type'] = 'application/json';
//     }

//     // Make the API call
//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       ...options,
//       headers,
//     });

//     // Handle different response types
//     const contentType = response.headers.get('content-type');
    
//     // If response is not ok, try to parse error
//     if (!response.ok) {
//       let errorMessage = `HTTP error! status: ${response.status}`;
      
//       try {
//         const errorData = await response.json();
//         errorMessage = errorData.message || errorMessage;
//       } catch (e) {
//         // If parsing fails, use default error message
//       }
      
//       // Handle 401 - Unauthorized
//       if (response.status === 401) {
//         localStorage.removeItem('superAdminToken');
//         localStorage.removeItem('superAdminUser');
//         window.location.href = '/login';
//         throw new Error('Session expired. Please login again.');
//       }
      
//       throw new Error(errorMessage);
//     }

//     // Handle different content types
//     if (contentType && contentType.includes('application/json')) {
//       return await response.json();
//     } else if (contentType && contentType.includes('text/csv')) {
//       return await response.text();
//     } else if (contentType && contentType.includes('blob')) {
//       return await response.blob();
//     } else {
//       return await response.text();
//     }
//   } catch (error) {
//     console.error('API Call Error:', error);
//     throw error;
//   }
// };

// /**
//  * Helper function for file uploads
//  * @param {string} endpoint - API endpoint
//  * @param {FormData} formData - FormData object with files
//  * @returns {Promise} - Response data
//  */
// export const superAdminFileUpload = async (endpoint, formData) => {
//   try {
//     const token = localStorage.getItem('superAdminToken');
    
//     if (!token) {
//       throw new Error('No authentication token found');
//     }

//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         // Don't set Content-Type for FormData - browser will set it with boundary
//       },
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || `Upload failed: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('File Upload Error:', error);
//     throw error;
//   }
// };

// export default superAdminApiCall;


















// src/utils/superAdminApi.js

// const API_BASE_URL = 'http://localhost:4000/api';

// /**
//  * Helper function for authenticated super admin API calls
//  */
// export const superAdminApiCall = async (endpoint, options = {}) => {
//   try {
//     const token = localStorage.getItem('superAdminToken');
    
//     if (!token) {
//       throw new Error('No authentication token found');
//     }

//     const headers = {
//       'Authorization': `Bearer ${token}`,
//       ...options.headers,
//     };

//     if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
//       headers['Content-Type'] = 'application/json';
//     }

//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       ...options,
//       headers,
//     });

//     const contentType = response.headers.get('content-type');
    
//     if (!response.ok) {
//       let errorMessage = `HTTP error! status: ${response.status}`;
      
//       try {
//         const errorData = await response.json();
//         errorMessage = errorData.message || errorMessage;
//       } catch (e) {
//         // Use default error message
//       }
      
//       if (response.status === 401) {
//         localStorage.removeItem('superAdminToken');
//         localStorage.removeItem('superAdminUser');
//         window.location.href = '/login';
//         throw new Error('Session expired. Please login again.');
//       }
      
//       throw new Error(errorMessage);
//     }

//     if (contentType && contentType.includes('application/json')) {
//       return await response.json();
//     } else if (contentType && contentType.includes('text/csv')) {
//       return await response.text();
//     } else if (contentType && contentType.includes('blob')) {
//       return await response.blob();
//     } else {
//       return await response.text();
//     }
//   } catch (error) {
//     console.error('API Call Error:', error);
//     throw error;
//   }
// };

// /**
//  * Helper function for file uploads
//  */
// export const superAdminFileUpload = async (endpoint, formData) => {
//   try {
//     const token = localStorage.getItem('superAdminToken');
    
//     if (!token) {
//       throw new Error('No authentication token found');
//     }

//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || `Upload failed: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('File Upload Error:', error);
//     throw error;
//   }
// };

// // =================== CUSTOMER MANAGEMENT APIs ===================

// export const customerAPI = {
//   /**
//    * Get all customers with filters and pagination
//    */
//   getAllCustomers: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     return superAdminApiCall(`/customer-management/customers?${queryString}`);
//   },

//   /**
//    * Get customer statistics
//    */
//   getCustomerStats: async () => {
//     return superAdminApiCall('/customer-management/customers/stats');
//   },

//   /**
//    * Get customer by ID
//    */
//   getCustomerById: async (id) => {
//     return superAdminApiCall(`/customer-management/customers/${id}`);
//   },

//   /**
//    * Get customer profile
//    */
//   getCustomerProfile: async (id) => {
//     return superAdminApiCall(`/customer-management/customers/${id}/profile`);
//   },

//   /**
//    * Get customer activity log
//    */
//   getCustomerActivity: async (id, limit = 50) => {
//     return superAdminApiCall(`/customer-management/customers/${id}/activity?limit=${limit}`);
//   },

//   /**
//    * Update customer details
//    */
//   updateCustomer: async (id, data) => {
//     return superAdminApiCall(`/customer-management/customers/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     });
//   },

//   /**
//    * Block customer
//    */
//   blockCustomer: async (id, reason) => {
//     return superAdminApiCall(`/customer-management/customers/${id}/block`, {
//       method: 'PATCH',
//       body: JSON.stringify({ reason }),
//     });
//   },

//   /**
//    * Unblock customer
//    */
//   unblockCustomer: async (id) => {
//     return superAdminApiCall(`/customer-management/customers/${id}/unblock`, {
//       method: 'PATCH',
//     });
//   },
// };

// // =================== SUPPORT TICKET APIs ===================

// export const supportAPI = {
//   /**
//    * Get all support tickets with filters
//    */
//   getAllTickets: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     return superAdminApiCall(`/support/tickets?${queryString}`);
//   },

//   /**
//    * Get ticket statistics
//    */
//   getTicketStats: async () => {
//     return superAdminApiCall('/support/tickets/stats');
//   },

//   /**
//    * Get ticket by ID
//    */
//   getTicketById: async (id) => {
//     return superAdminApiCall(`/support/tickets/${id}`);
//   },

//   /**
//    * Create new ticket
//    */
//   createTicket: async (data) => {
//     return superAdminApiCall('/support/tickets', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   },

//   /**
//    * Assign ticket to admin
//    */
//   assignTicket: async (id, adminId) => {
//     return superAdminApiCall(`/support/tickets/${id}/assign`, {
//       method: 'PATCH',
//       body: JSON.stringify({ adminId }),
//     });
//   },

//   /**
//    * Add reply to ticket
//    */
//   addReply: async (id, message, attachments = []) => {
//     return superAdminApiCall(`/support/tickets/${id}/reply`, {
//       method: 'POST',
//       body: JSON.stringify({ message, attachments }),
//     });
//   },

//   /**
//    * Add internal note
//    */
//   addInternalNote: async (id, note) => {
//     return superAdminApiCall(`/support/tickets/${id}/note`, {
//       method: 'POST',
//       body: JSON.stringify({ note }),
//     });
//   },

//   /**
//    * Update ticket priority
//    */
//   updatePriority: async (id, priority) => {
//     return superAdminApiCall(`/support/tickets/${id}/priority`, {
//       method: 'PATCH',
//       body: JSON.stringify({ priority }),
//     });
//   },

//   /**
//    * Update ticket status
//    */
//   updateStatus: async (id, status) => {
//     return superAdminApiCall(`/support/tickets/${id}/status`, {
//       method: 'PATCH',
//       body: JSON.stringify({ status }),
//     });
//   },

//   /**
//    * Close ticket with resolution
//    */
//   closeTicket: async (id, resolutionNote) => {
//     return superAdminApiCall(`/support/tickets/${id}/close`, {
//       method: 'PATCH',
//       body: JSON.stringify({ resolutionNote }),
//     });
//   },

//   /**
//    * Reopen ticket
//    */
//   reopenTicket: async (id, reason) => {
//     return superAdminApiCall(`/support/tickets/${id}/reopen`, {
//       method: 'PATCH',
//       body: JSON.stringify({ reason }),
//     });
//   },
// };

// // =================== RESPONSE TEMPLATE APIs ===================

// export const templateAPI = {
//   /**
//    * Get all response templates
//    */
//   getAllTemplates: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     return superAdminApiCall(`/support/templates?${queryString}`);
//   },

//   /**
//    * Get template by ID
//    */
//   getTemplateById: async (id) => {
//     return superAdminApiCall(`/support/templates/${id}`);
//   },

//   /**
//    * Get templates by issue type
//    */
//   getTemplatesByIssueType: async (issueType) => {
//     return superAdminApiCall(`/support/templates/type/${issueType}`);
//   },

//   /**
//    * Create new template
//    */
//   createTemplate: async (data) => {
//     return superAdminApiCall('/support/templates', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   },

//   /**
//    * Update template
//    */
//   updateTemplate: async (id, data) => {
//     return superAdminApiCall(`/support/templates/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     });
//   },

//   /**
//    * Delete template
//    */
//   deleteTemplate: async (id) => {
//     return superAdminApiCall(`/support/templates/${id}`, {
//       method: 'DELETE',
//     });
//   },
// };

// export default superAdminApiCall;



// src/utils/superAdminApi.js

const API_BASE_URL = 'http://localhost:4000/api';

/**
 * Helper function for authenticated super admin API calls
 */
export const superAdminApiCall = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('superAdminToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Use default error message
      }
      
      if (response.status === 401) {
        localStorage.removeItem('superAdminToken');
        localStorage.removeItem('superAdminUser');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
      
      throw new Error(errorMessage);
    }

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

// =================== DEFAULT EXPORT OBJECT WITH ALL APIs ===================

const superAdminApi = {
  // ========== CUSTOMER MANAGEMENT APIs ==========
  
  /**
   * Fetch customer statistics
   */
  fetchCustomerStats: async () => {
    return superAdminApiCall('/customer-management/customers/stats');
  },

  /**
   * Fetch customers with filters
   */
  fetchCustomers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return superAdminApiCall(`/customer-management/customers?${queryString}`);
  },

  /**
   * Fetch customer by ID
   */
  fetchCustomerById: async (id) => {
    return superAdminApiCall(`/customer-management/customers/${id}`);
  },

  /**
   * Fetch customer activity log
   */
  fetchCustomerActivity: async (id, limit = 50) => {
    return superAdminApiCall(`/customer-management/customers/${id}/activity?limit=${limit}`);
  },

  /**
   * Block customer
   */
  blockCustomer: async (id, reason) => {
    return superAdminApiCall(`/customer-management/customers/${id}/block`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },

  /**
   * Unblock customer
   */
  unblockCustomer: async (id) => {
    return superAdminApiCall(`/customer-management/customers/${id}/unblock`, {
      method: 'PATCH',
    });
  },

  /**
   * Update customer details
   */
  updateCustomer: async (id, data) => {
    return superAdminApiCall(`/customer-management/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // ========== SUPPORT TICKET APIs ==========
  
  /**
   * Fetch ticket statistics
   */
  fetchTicketStats: async () => {
    return superAdminApiCall('/support/tickets/stats');
  },

  /**
   * Fetch tickets with filters
   */
  fetchTickets: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return superAdminApiCall(`/support/tickets?${queryString}`);
  },

  /**
   * Fetch ticket by ID
   */
  fetchTicketById: async (id) => {
    return superAdminApiCall(`/support/tickets/${id}`);
  },

  /**
   * Create new ticket
   */
  createTicket: async (data) => {
    return superAdminApiCall('/support/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Assign ticket to admin
   */
  assignTicket: async (id, adminId) => {
    return superAdminApiCall(`/support/tickets/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ adminId }),
    });
  },

  /**
   * Add reply to ticket
   */
  addReply: async (id, message, attachments = []) => {
    return superAdminApiCall(`/support/tickets/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message, attachments }),
    });
  },

  /**
   * Add internal note
   */
  addInternalNote: async (id, note) => {
    return superAdminApiCall(`/support/tickets/${id}/note`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
  },

  /**
   * Update ticket status
   */
  updateTicketStatus: async (id, status) => {
    return superAdminApiCall(`/support/tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Update ticket priority
   */
  updateTicketPriority: async (id, priority) => {
    return superAdminApiCall(`/support/tickets/${id}/priority`, {
      method: 'PATCH',
      body: JSON.stringify({ priority }),
    });
  },

  /**
   * Close ticket
   */
  closeTicket: async (id, resolutionNote) => {
    return superAdminApiCall(`/support/tickets/${id}/close`, {
      method: 'PATCH',
      body: JSON.stringify({ resolutionNote }),
    });
  },

  /**
   * Reopen ticket
   */
  reopenTicket: async (id, reason) => {
    return superAdminApiCall(`/support/tickets/${id}/reopen`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },

  // ========== TEMPLATE APIs ==========
  
  /**
   * Fetch all templates
   */
  fetchTemplates: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return superAdminApiCall(`/support/templates?${queryString}`);
  },

  /**
   * Fetch template by ID
   */
  fetchTemplateById: async (id) => {
    return superAdminApiCall(`/support/templates/${id}`);
  },

  /**
   * Fetch templates by issue type
   */
  fetchTemplatesByIssueType: async (issueType) => {
    return superAdminApiCall(`/support/templates/type/${issueType}`);
  },

  /**
   * Create new template
   */
  createTemplate: async (data) => {
    return superAdminApiCall('/support/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update template
   */
  updateTemplate: async (id, data) => {
    return superAdminApiCall(`/support/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete template
   */
  deleteTemplate: async (id) => {
    return superAdminApiCall(`/support/templates/${id}`, {
      method: 'DELETE',
    });
  },
};

// Keep the old exports for backward compatibility
export const customerAPI = {
  getAllCustomers: superAdminApi.fetchCustomers,
  getCustomerStats: superAdminApi.fetchCustomerStats,
  getCustomerById: superAdminApi.fetchCustomerById,
  getCustomerProfile: superAdminApi.fetchCustomerById,
  getCustomerActivity: superAdminApi.fetchCustomerActivity,
  updateCustomer: superAdminApi.updateCustomer,
  blockCustomer: superAdminApi.blockCustomer,
  unblockCustomer: superAdminApi.unblockCustomer,
};

export const supportAPI = {
  getAllTickets: superAdminApi.fetchTickets,
  getTicketStats: superAdminApi.fetchTicketStats,
  getTicketById: superAdminApi.fetchTicketById,
  createTicket: superAdminApi.createTicket,
  assignTicket: superAdminApi.assignTicket,
  addReply: superAdminApi.addReply,
  addInternalNote: superAdminApi.addInternalNote,
  updatePriority: superAdminApi.updateTicketPriority,
  updateStatus: superAdminApi.updateTicketStatus,
  closeTicket: superAdminApi.closeTicket,
  reopenTicket: superAdminApi.reopenTicket,
};

export const templateAPI = {
  getAllTemplates: superAdminApi.fetchTemplates,
  getTemplateById: superAdminApi.fetchTemplateById,
  getTemplatesByIssueType: superAdminApi.fetchTemplatesByIssueType,
  createTemplate: superAdminApi.createTemplate,
  updateTemplate: superAdminApi.updateTemplate,
  deleteTemplate: superAdminApi.deleteTemplate,
};

export default superAdminApi;