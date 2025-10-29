// src/pages/ResponseTemplates.jsx
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import TemplateList from '../components/templates/TemplateList';
import CreateTemplateModal from '../components/templates/CreateTemplateModal';
import EditTemplateModal from '../components/templates/EditTemplateModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ResponseTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null); // Template to be edited

  // MOCK API Interaction (Replace with actual superAdminApi calls)
  useEffect(() => {
    const fetchTemplates = () => {
        setLoading(true);
        // Mock data fetch
        setTimeout(() => {
            setTemplates([
                { _id: 't1', title: 'Payment Issue Acknowledgment', content: 'We have received your request regarding the payment issue and are currently investigating the matter with our finance team...', issueType: 'Billing', isActive: true },
                { _id: 't2', title: 'Standard Technical Support Reply', content: 'Please try clearing your browser cache and cookies, then try again. If the issue persists, please send us a screenshot of the error.', issueType: 'Technical', isActive: true },
                { _id: 't3', title: 'Order Cancellation Confirmation', content: 'Your order #{OrderNumber} has been successfully cancelled. A refund of {Amount} will be processed to your original payment method within 5-7 business days.', issueType: 'Order', isActive: false },
            ]);
            setLoading(false);
        }, 800);
    };
    fetchTemplates();
  }, []);

  const handleCreateTemplate = (newTemplate) => {
    setLoading(true);
    // API call: superAdminApi.createTemplate(newTemplate)
    setTimeout(() => {
        setTemplates([...templates, { ...newTemplate, _id: Date.now().toString() }]);
        setLoading(false);
        setIsCreateModalOpen(false);
    }, 500);
  };

  const handleEditTemplate = (id, updatedTemplate) => {
    setLoading(true);
    // API call: superAdminApi.updateTemplate(id, updatedTemplate)
    setTimeout(() => {
        setTemplates(templates.map(t => t._id === id ? updatedTemplate : t));
        setLoading(false);
        setEditTemplate(null);
    }, 500);
  };

  const handleDeleteTemplate = (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
        setLoading(true);
        // API call: superAdminApi.deleteTemplate(id)
        setTimeout(() => {
            setTemplates(templates.filter(t => t._id !== id));
            setLoading(false);
        }, 500);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Response Templates Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <Plus size={20} /> New Template
        </button>
      </div>

      <div className="mt-6">
        {loading && <LoadingSpinner />}
        {error && <p className="text-red-600">Error fetching templates: {error}</p>}
        {!loading && !error && (
            <TemplateList 
                templates={templates} 
                onEdit={setEditTemplate} 
                onDelete={handleDeleteTemplate} 
            />
        )}
      </div>

      {isCreateModalOpen && (
        <CreateTemplateModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onConfirm={handleCreateTemplate} 
          loading={loading}
        />
      )}

      {editTemplate && (
        <EditTemplateModal 
          template={editTemplate}
          onClose={() => setEditTemplate(null)} 
          onConfirm={handleEditTemplate} 
          loading={loading}
        />
      )}
    </div>
  );
};

export default ResponseTemplates;