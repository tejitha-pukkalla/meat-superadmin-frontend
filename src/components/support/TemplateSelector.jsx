// src/components/support/TemplateSelector.jsx
import { FileText, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
// Assuming a custom hook or API service for fetching templates
// import useSuperAdminApi from '../../utils/useSuperAdminApi'; 

const TemplateSelector = ({ issueType, onSelect }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // In a real app, this would use a fetch/hook call based on issueType
  useEffect(() => {
    const fetchTemplates = () => {
        setLoading(true);
        setError(null);
        // MOCK API CALL - Replace with actual API call to getTemplatesByIssueType
        setTimeout(() => {
            const mockTemplates = [
                { id: 1, title: `Standard ${issueType} Reply`, content: `Dear customer, regarding your ${issueType} issue, we have taken the following steps...` },
                { id: 2, title: 'Escalation Response', content: 'We are escalating your concern to our specialized team. We will update you within 24 hours.' },
            ];
            setTemplates(mockTemplates);
            setLoading(false);
        }, 500);
    };

    fetchTemplates();
  }, [issueType]);

  const handleSelectChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id.toString() === templateId);
    if (template) {
      onSelect(template.content);
    }
  };

  return (
    <div className="relative">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
        <FileText size={16} /> Select Response Template
      </label>
      <div className="relative">
        <select
          value={selectedTemplate}
          onChange={handleSelectChange}
          className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-sm pr-10"
          disabled={loading || templates.length === 0}
        >
          <option value="">{loading ? 'Loading Templates...' : 'Select a Template...'}</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.title}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default TemplateSelector;