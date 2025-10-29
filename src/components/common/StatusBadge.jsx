// src/components/common/StatusBadge.jsx
const StatusBadge = ({ status }) => {
  const getStatusColor = (s) => {
    switch (s) {
      case 'Active':
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Blocked':
      case 'Closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Inactive':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Open':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;