// src/components/common/Alert.jsx

import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const Alert = ({ type = 'info', message, onClose }) => {
  const config = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: AlertCircle,
      iconColor: 'text-red-600',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600',
    },
  };

  const { bg, border, text, icon: Icon, iconColor } = config[type] || config.info;

  return (
    <div className={`${bg} ${border} ${text} border rounded-lg p-4 mb-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`${iconColor} mt-0.5 flex-shrink-0`} size={20} />
        <p className="flex-1 text-sm font-medium">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className={`${iconColor} hover:opacity-75 transition-opacity flex-shrink-0`}
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;