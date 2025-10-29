// src/components/templates/TemplateCard.jsx
import { FileText, Edit, Trash2, Tag, CheckCircle } from 'lucide-react';

const TemplateCard = ({ template, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FileText size={20} className="text-red-600" />
          {template.title}
        </h3>
        <div className="flex items-center gap-2">
            {template.isActive && (
                <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    <CheckCircle size={12} /> Active
                </span>
            )}
        </div>
      </div>

      <div className="text-sm text-gray-500 flex items-center gap-2">
        <Tag size={14} /> Category: <span className="font-medium text-gray-700">{template.issueType}</span>
      </div>

      <p className="text-gray-600 text-sm line-clamp-3">
        {template.content}
      </p>

      <div className="flex gap-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(template)}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <Edit size={16} /> Edit
        </button>
        <button
          onClick={() => onDelete(template._id)}
          className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;