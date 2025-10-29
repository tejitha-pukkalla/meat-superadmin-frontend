// src/components/support/InternalNoteModal.jsx
import { X, StickyNote } from 'lucide-react';
import { useState } from 'react';

const InternalNoteModal = ({ ticketId, onClose, onConfirm, loading }) => {
  const [noteContent, setNoteContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (noteContent.trim()) {
      onConfirm(ticketId, noteContent.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <StickyNote size={24} /> Add Internal Note to Ticket #{ticketId}
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 border-l-4 border-yellow-500 pl-3 py-1 bg-yellow-50 rounded">
            This note will **NOT** be visible to the customer. For internal team communication only.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note Content <span className="text-red-500">*</span></label>
            <textarea
              required
              rows="6"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-sm"
              placeholder="Document next steps, internal discussions, or private context..."
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
            className="flex items-center gap-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !noteContent.trim()}
          >
            {loading ? 'Saving...' : 'Add Note'} <StickyNote size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default InternalNoteModal;