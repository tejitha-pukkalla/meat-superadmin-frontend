// src/utils/customerHelpers.js

/**
 * Formats a raw number to a currency string (e.g., 154320.50 to ₹1,54,320.50)
 * @param {number} amount - The amount to format.
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '₹0.00';
    return `₹${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`; // Basic formatting
    // For proper Indian currency format, you would use:
    // return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

/**
 * Formats a date string into a user-friendly format.
 * @param {string | Date} dateInput - The date to format.
 * @returns {string} The formatted date string.
 */
export const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';
    try {
        return new Date(dateInput).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch (e) {
        return 'Invalid Date';
    }
};

/**
 * Calculates a customer's rank based on total spending or orders.
 * @param {number} value - The customer's metric value (spending/orders).
 * @param {string} type - The metric type ('spending' or 'orders').
 * @returns {string} The customer's status/rank.
 */
export const getCustomerRank = (value, type) => {
    if (type === 'spending') {
        if (value >= 50000) return 'VIP';
        if (value >= 10000) return 'Gold';
        return 'Standard';
    }
    if (type === 'orders') {
        if (value >= 50) return 'Elite Buyer';
        if (value >= 15) return 'Frequent Buyer';
        return 'New Buyer';
    }
    return 'N/A';
};