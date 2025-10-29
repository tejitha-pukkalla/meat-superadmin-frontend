// src/components/support/TicketDetailsModal.jsx
import { X, Hash, Tag, Clock, User, MessageSquare } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';

const TicketDetailsModal = ({ ticket, onClose, onGoToFullDetails }) => {
  if (!ticket) return null;

  const formatDate = (date) => new Date(date).toLocaleString();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{ticket.subject}</h3>
            <div className="flex items-center gap-3">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 border-b pb-4">
            <div className="flex items-center gap-2"><Hash size={16} /> <span className="font-medium">ID:</span> #{ticket.ticketId}</div>
            <div className="flex items-center gap-2"><Tag size={16} /> <span className="font-medium">Type:</span> {ticket.issueType}</div>
            <div className="flex items-center gap-2"><User size={16} /> <span className="font-medium">Customer:</span> {ticket.customerName || 'N/A'}</div>
            <div className="flex items-center gap-2"><User size={16} /> <span className="font-medium">Assigned:</span> {ticket.assignedToName || 'Unassigned'}</div>
            <div className="flex items-center gap-2"><Clock size={16} /> <span className="font-medium">Created:</span> {formatDate(ticket.createdAt)}</div>
            {ticket.resolvedAt && <div className="flex items-center gap-2"><Check size={16} /> <span className="font-medium">Resolved:</span> {formatDate(ticket.resolvedAt)}</div>}
          </div>

          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-800">Description:</p>
            <p className="text-gray-600 whitespace-pre-wrap">{ticket.description}</p>
          </div>

          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <MessageSquare size={20} /> Latest Reply
            </p>
            {ticket.latestReply ? (
                <div className="p-3 bg-gray-100 rounded-lg text-sm text-gray-600 border-l-4 border-blue-500">
                    <p className="font-medium mb-1">From: {ticket.latestReply.author}</p>
                    <p className="text-xs text-gray-500 mb-2">{formatDate(ticket.latestReply.timestamp)}</p>
                    <p>{ticket.latestReply.content.substring(0, 150)}...</p>
                </div>
            ) : (
                <p className="text-sm text-gray-500">No replies yet.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onGoToFullDetails}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            View Full Ticket
          </button>
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

export default TicketDetailsModal;