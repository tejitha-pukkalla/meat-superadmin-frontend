// src/components/support/AddReplyModal.jsx
import { X, Send } from 'lucide-react';
import { useState } from 'react';
import TemplateSelector from './TemplateSelector';

const AddReplyModal = ({ ticketId, onClose, onConfirm, loading }) => {
  const [replyContent, setReplyContent] = useState('');

  const handleTemplateSelect = (templateContent) => {
    setReplyContent(templateContent);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onConfirm(ticketId, replyContent.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-xl font-semibold text-gray-900">Add Public Reply to Ticket #{ticketId}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <TemplateSelector onSelect={handleTemplateSelect} issueType="General" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reply Content <span className="text-red-500">*</span></label>
            <textarea
              required
              rows="6"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="Type your official response to the customer here..."
            ></textarea>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !replyContent.trim()}
          >
            {loading ? 'Sending...' : 'Send Reply'} <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReplyModal;