// src/components/common/PriorityBadge.jsx
const PriorityBadge = ({ priority }) => {
  const getPriorityColor = (p) => {
    switch (p) {
      case 'Urgent':
      case 'High':
        return 'bg-red-600 text-white';
      case 'Medium':
        return 'bg-yellow-500 text-white';
      case 'Low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(priority)}`}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;