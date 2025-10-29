// src/pages/TicketDetails.jsx
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Tag, Clock, User, Hash, MessageSquare, StickyNote, CornerDownLeft, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import AddReplyModal from '../components/support/AddReplyModal';
import InternalNoteModal from '../components/support/InternalNoteModal';
import { useState } from 'react';

const TicketDetails = () => {
  const { id } = useParams();
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  // MOCK DATA for demonstration
  const ticket = {
    _id: id,
    ticketId: 'TKT-00123',
    subject: 'Issue with recent payment on Order #4567',
    description: 'The customer\'s payment failed multiple times for order #4567, but their bank confirmed the charge. They are requesting manual order confirmation.',
    status: 'In Progress',
    priority: 'High',
    issueType: 'Billing',
    customerName: 'Ravi Teja',
    customerEmail: 'ravi.teja@example.com',
    assignedToName: 'Admin Staff 1',
    createdAt: '2024-10-25T14:30:00Z',
    updatedAt: '2024-10-26T10:00:00Z',
    conversation: [
        { type: 'Customer', content: 'My payment failed, but my bank statement shows a charge. Please help!', timestamp: '2024-10-25T14:30:00Z' },
        { type: 'Agent', content: 'We apologize for the inconvenience. We are investigating the issue with our payment processor. We will update you shortly.', timestamp: '2024-10-25T15:00:00Z' },
        { type: 'Internal Note', content: 'Contacted Stripe support. Waiting for response. Assigned to Admin Staff 1.', timestamp: '2024-10-25T16:00:00Z' },
        { type: 'Agent', content: 'The payment has been manually confirmed. Your order #4567 is now processing. Thank you for your patience.', timestamp: '2024-10-26T10:00:00Z' },
    ]
  };

  const formatDate = (date) => new Date(date).toLocaleString();

  const handleAction = (action) => {
    // Implement API call for Assign, Close, Reopen, etc.
    alert(`Action: ${action} on ticket ${id}`);
  };
  
  // Placeholder for reply/note logic
  const handleAddReply = (tid, content) => {
    alert(`Sending reply to ${tid}: ${content}`);
    setShowReplyModal(false);
  };

  const handleAddNote = (tid, content) => {
    alert(`Adding internal note to ${tid}: ${content}`);
    setShowNoteModal(false);
  };

  return (
    <div className="p-8">
      <Link to="/support-tickets" className="flex items-center gap-2 text-red-600 hover:text-red-700 mb-6 font-medium">
        <ArrowLeft size={20} /> Back to Tickets
      </Link>

      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="border-b pb-4 mb-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{ticket.subject}</h1>
            <div className="flex gap-2">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1"><Hash size={14} /> ID: #{ticket.ticketId}</div>
            <div className="flex items-center gap-1"><User size={14} /> Customer: {ticket.customerName}</div>
            <div className="flex items-center gap-1"><Tag size={14} /> Type: {ticket.issueType}</div>
            <div className="flex items-center gap-1"><Clock size={14} /> Created: {formatDate(ticket.createdAt)}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex gap-3">
          <button onClick={() => setShowReplyModal(true)} className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            <CornerDownLeft size={16} /> Add Reply
          </button>
          <button onClick={() => setShowNoteModal(true)} className="flex items-center gap-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium">
            <StickyNote size={16} /> Internal Note
          </button>
          {ticket.status !== 'Closed' && ticket.status !== 'Resolved' ? (
              <button onClick={() => handleAction('close')} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                  <CheckCircle size={16} /> Mark as Closed
              </button>
          ) : (
              <button onClick={() => handleAction('reopen')} className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                  Reopen Ticket
              </button>
          )}
        </div>

        {/* Conversation Log */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Conversation History</h2>
        <div className="space-y-4">
          {ticket.conversation.map((message, index) => (
            <div key={index} className={`p-4 rounded-lg ${
                message.type === 'Customer' ? 'bg-blue-50 border-l-4 border-blue-500' : 
                message.type === 'Agent' ? 'bg-green-50 border-l-4 border-green-500' : 
                'bg-yellow-50 border-l-4 border-yellow-500' // Internal Note
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm">
                  {message.type === 'Internal Note' ? 'Internal Note' : `${message.type} (${message.author || ticket.customerName || 'N/A'})`}
                </span>
                <span className="text-xs text-gray-500">{formatDate(message.timestamp)}</span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
        </div>
      </div>

      {showReplyModal && (
          <AddReplyModal ticketId={ticket._id} onClose={() => setShowReplyModal(false)} onConfirm={handleAddReply} loading={false} />
      )}
      {showNoteModal && (
          <InternalNoteModal ticketId={ticket._id} onClose={() => setShowNoteModal(false)} onConfirm={handleAddNote} loading={false} />
      )}
    </div>
  );
};

export default TicketDetails;