// src/components/customers/CustomerFilters.jsx
import { useState } from 'react';
import { Search, Filter, X, Calendar, DollarSign, ShoppingBag, SlidersHorizontal } from 'lucide-react';

const CustomerFilters = ({ filters, onFilterChange, onSearch, onReset }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value, page: 1 });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const handleReset = () => {
    onReset();
    setShowAdvanced(false);
  };

  const hasActiveFilters = () => {
    return (
      filters.status ||
      filters.startDate ||
      filters.endDate ||
      filters.minOrders ||
      filters.maxOrders ||
      filters.minSpending ||
      filters.maxSpending
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => handleInputChange('search', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </form>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            showAdvanced
              ? 'bg-red-50 border-red-300 text-red-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal size={18} />
          <span>Advanced Filters</span>
          {hasActiveFilters() && (
            <span className="ml-1 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">
              Active
            </span>
          )}
        </button>

        <select
          value={filters.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => handleInputChange('sortBy', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
        >
          <option value="createdAt">Registration Date</option>
          <option value="totalOrders">Total Orders</option>
          <option value="totalSpending">Total Spending</option>
          <option value="name">Name</option>
        </select>

        <select
          value={filters.sortOrder}
          onChange={(e) => handleInputChange('sortOrder', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>

        {hasActiveFilters() && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            <X size={18} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Filter size={16} />
            Advanced Filters
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar size={16} />
                Registration Date From
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar size={16} />
                Registration Date To
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>

            {/* Order Count Range */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ShoppingBag size={16} />
                Min Orders
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={filters.minOrders}
                onChange={(e) => handleInputChange('minOrders', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ShoppingBag size={16} />
                Max Orders
              </label>
              <input
                type="number"
                min="0"
                placeholder="Any"
                value={filters.maxOrders}
                onChange={(e) => handleInputChange('maxOrders', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>

            {/* Spending Range */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <DollarSign size={16} />
                Min Spending (₹)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                placeholder="0"
                value={filters.minSpending}
                onChange={(e) => handleInputChange('minSpending', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <DollarSign size={16} />
                Max Spending (₹)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                placeholder="Any"
                value={filters.maxSpending}
                onChange={(e) => handleInputChange('maxSpending', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>
          </div>

          {/* Apply Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={onSearch}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerFilters;