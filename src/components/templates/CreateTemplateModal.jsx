// src/components/templates/CreateTemplateModal.jsx
import { X, FilePlus } from 'lucide-react';
import { useState } from 'react';

const CreateTemplateModal = ({ onClose, onConfirm, loading }) => {
  const [template, setTemplate] = useState({
    title: '',
    content: '',
    issueType: 'General',
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTemplate({ 
        ...template, 
        [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(template);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FilePlus size={24} /> Create New Template
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="title"
              required
              value={template.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="e.g., Standard Refund Procedure"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
            <select
              name="issueType"
              value={template.issueType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
            >
              {['General', 'Technical', 'Billing', 'Order'].map(type => (
                  <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template Content <span className="text-red-500">*</span></label>
            <textarea
              name="content"
              required
              rows="6"
              value={template.content}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="The body of the response (supports simple placeholders like {CustomerName})"
            ></textarea>
          </div>

          <div className="flex items-center">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={template.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Set as Active (Available in Template Selector)
            </label>
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
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !template.title || !template.content}
          >
            {loading ? 'Creating...' : 'Create Template'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTemplateModal;