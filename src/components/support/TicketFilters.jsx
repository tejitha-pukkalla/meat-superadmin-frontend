// src/components/support/TicketFilters.jsx
import { Search, Filter, X, Clock, User, Tag, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

const TICKET_STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];
const TICKET_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
const ISSUE_TYPES = ['Technical', 'Billing', 'Order', 'General']; // Example types

const TicketFilters = ({ filters, onFilterChange, onSearch, onReset }) => {
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

  const hasAdvancedFilters = () => {
    return filters.priority || filters.issueType || filters.assignedTo || filters.startDate || filters.endDate;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="flex gap-4">
          {/* Main Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by Ticket ID or Subject..."
              value={filters.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
          >
            <option value="">All Statuses</option>
            {TICKET_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Advanced Filter Button */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1 px-4 py-2 border rounded-lg transition-colors text-sm font-medium ${
              showAdvanced || hasAdvancedFilters() ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter size={16} />
            Advanced
          </button>
        </div>
      </form>

      {/* Advanced Filters Section */}
      {showAdvanced && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Priority Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><ArrowUpDown size={14} /> Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
              >
                <option value="">All Priorities</option>
                {TICKET_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Issue Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><Tag size={14} /> Issue Type</label>
              <select
                value={filters.issueType}
                onChange={(e) => handleInputChange('issueType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
              >
                <option value="">All Types</option>
                {ISSUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Assigned To Filter (Dropdown of Admins/Support Staff) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><User size={14} /> Assigned To</label>
              <input
                type="text"
                placeholder="Staff ID or Name"
                value={filters.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>

            {/* Date Range Filter (Simple) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><Clock size={14} /> Date Range</label>
              <input
                type="date"
                placeholder="Start Date"
                value={filters.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={16} /> Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketFilters;