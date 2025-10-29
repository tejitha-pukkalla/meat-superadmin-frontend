// src/components/customers/ActivityLogModal.jsx
import { X, Clock, Zap } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const ActivityLogModal = ({ customer, log, onClose, loading }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-xl font-semibold text-gray-900">
            Activity Log for {customer?.name}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <LoadingSpinner />
            </div>
          ) : log && log.length > 0 ? (
            <ol className="relative border-l border-gray-200">
              {log.map((item, index) => (
                <li key={index} className="mb-8 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                    <Zap size={12} className="text-blue-600" />
                  </span>
                  <h4 className="flex items-center mb-1 text-base font-semibold text-gray-900">
                    {item.action}
                  </h4>
                  <time className="block mb-2 text-xs font-normal leading-none text-gray-400 flex items-center gap-1">
                    <Clock size={12} />
                    {formatDate(item.timestamp)}
                  </time>
                  <p className="text-sm font-normal text-gray-500">
                    {item.details}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-center text-gray-500">No activity logged for this customer.</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogModal;