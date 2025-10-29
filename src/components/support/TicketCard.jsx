// src/components/support/TicketCard.jsx
import { Tag, Clock, User, MessageSquare } from 'lucide-react';
import PriorityBadge from '../common/PriorityBadge';
import StatusBadge from '../common/StatusBadge';

const TicketCard = ({ ticket, onView }) => {
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-5 space-y-3">
      <div className="flex items-start justify-between">
        {/* ID and Status */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-gray-700">#{ticket.ticketId}</p>
          <StatusBadge status={ticket.status} />
        </div>
        {/* Priority */}
        <PriorityBadge priority={ticket.priority} />
      </div>

      {/* Subject */}
      <h3 className="text-lg font-bold text-gray-900 hover:text-red-600 cursor-pointer" onClick={() => onView(ticket)}>
        {ticket.subject}
      </h3>

      {/* Meta Info */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-1"><User size={14} /> Customer: {ticket.customerName}</div>
        <div className="flex items-center gap-1"><Tag size={14} /> Type: {ticket.issueType}</div>
        <div className="flex items-center gap-1"><Clock size={14} /> Created: {formatDate(ticket.createdAt)}</div>
        <div className="flex items-center gap-1"><MessageSquare size={14} /> Replies: {ticket.repliesCount || 0}</div>
      </div>

      {/* Action */}
      <button
        onClick={() => onView(ticket)}
        className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        View Details
      </button>
    </div>
  );
};

export default TicketCard;