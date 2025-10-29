// src/components/templates/TemplateList.jsx
import TemplateCard from './TemplateCard';

const TemplateList = ({ templates, onEdit, onDelete }) => {
  if (!templates || templates.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
        No response templates have been created yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateCard
          key={template._id}
          template={template}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TemplateList;