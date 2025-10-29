// src/components/customers/CustomerCard.jsx
import { User, Mail, Phone, Calendar, ShoppingBag, DollarSign, MapPin } from 'lucide-react';

const CustomerCard = ({ customer, onView, onBlock, onUnblock }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {customer.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(customer.status)}`}>
              {customer.status}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail size={16} className="text-gray-400" />
          <span className="truncate">{customer.email}</span>
        </div>
        {customer.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={16} className="text-gray-400" />
            <span>{customer.phone}</span>
          </div>
        )}
        {customer.addresses && customer.addresses.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-gray-400" />
            <span className="truncate">{customer.addresses[0].city}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
            <ShoppingBag size={16} />
            <span className="text-xs">Orders</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{customer.totalOrders || 0}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
            <DollarSign size={16} />
            <span className="text-xs">Spending</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            ₹{(customer.totalSpending || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Join Date */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <Calendar size={14} />
        <span>Joined {formatDate(customer.createdAt)}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onView(customer)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          View Details
        </button>
        {customer.status === 'Blocked' ? (
          <button
            onClick={() => onUnblock(customer._id)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Unblock
          </button>
        ) : (
          <button
            onClick={() => onBlock(customer)}
            className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
          >
            Block
          </button>
        )}
      </div>

      {/* Block Reason */}
      {customer.status === 'Blocked' && customer.blockReason && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Block Reason:</p>
          <p className="text-sm text-red-600">{customer.blockReason}</p>
        </div>
      )}
    </div>
  );
};

export default CustomerCard;