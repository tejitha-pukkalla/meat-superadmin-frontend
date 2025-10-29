// // src/components/customers/BlockCustomerModal.jsx
// import { useState } from 'react';
// import { X, AlertTriangle } from 'lucide-react';

// const BlockCustomerModal = ({ customer, onClose, onConfirm, loading }) => {
//   const [reason, setReason] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!reason.trim()) {
//       setError('Please provide a reason for blocking this customer');
//       return;
//     }

//     if (reason.trim().length < 10) {
//       setError('Reason must be at least 10 characters long');
//       return;
//     }

//     onConfirm(reason.trim());
//   };

//   const commonReasons = [
//     'Fraudulent activity detected',
//     'Multiple payment failures',
//     'Abusive behavior towards vendors',
//     'Terms of service violation',
//     'Suspicious account activity',
//     'Repeated order cancellations',
//   ];

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//               <AlertTriangle className="text-red-600" size={20} />
//             </div>
//             <div>
//               <h3 className="text-lg font-bold text-gray-900">Block Customer</h3>
//               <p className="text-sm text-gray-500">This action will restrict customer access</p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             disabled={loading}
//           >
//             <X size={20} className="text-gray-500" />
//           </button>
//         </div>

//         {/* Content */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Customer Info */}
//           <div className="bg-gray-50 rounded-lg p-4">
//             <p className="text-sm text-gray-600 mb-2">You are about to block:</p>
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
//                 <span className="text-white font-bold text-lg">
//                   {customer?.name?.charAt(0).toUpperCase()}
//                 </span>
//               </div>
//               <div>
//                 <p className="font-semibold text-gray-900">{customer?.name}</p>
//                 <p className="text-sm text-gray-500">{customer?.email}</p>
//               </div>
//             </div>
//           </div>

//           {/* Warning */}
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//             <div className="flex gap-3">
//               <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
//               <div className="flex-1">
//                 <p className="text-sm font-medium text-yellow-800 mb-1">
//                   Important Notice
//                 </p>
//                 <ul className="text-xs text-yellow-700 space-y-1">
//                   <li>• Customer will not be able to place new orders</li>
//                   <li>• Existing orders will not be affected</li>
//                   <li>• Customer can still view order history</li>
//                   <li>• This action can be reversed later</li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {/* Quick Reasons */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Quick Select Reason
//             </label>
//             <div className="grid grid-cols-1 gap-2">
//               {commonReasons.map((commonReason, index) => (
//                 <button
//                   key={index}
//                   type="button"
//                   onClick={() => setReason(commonReason)}
//                   className={`text-left px-4 py-2 rounded-lg border transition-colors text-sm ${
//                     reason === commonReason
//                       ? 'border-red-600 bg-red-50 text-red-700'
//                       : 'border-gray-300 hover:bg-gray-50 text-gray-700'
//                   }`}
//                 >
//                   {commonReason}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Custom Reason */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Block Reason <span className="text-red-600">*</span>
//             </label>
//             <textarea
//               value={reason}
//               onChange={(e) => {
//                 setReason(e.target.value);
//                 setError('');
//               }}
//               placeholder="Provide a detailed reason for blocking this customer..."
//               rows="4"
//               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none ${
//                 error ? 'border-red-300' : 'border-gray-300'
//               }`}
//               disabled={loading}
//             />
//             {error && (
//               <p className="mt-1 text-sm text-red-600">{error}</p>
//             )}
//             <p className="mt-1 text-xs text-gray-500">
//               Minimum 10 characters required
//             </p>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-3 pt-4 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={loading || !reason.trim()}
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Blocking...
//                 </span>
//               ) : (
//                 'Block Customer'
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BlockCustomerModal;


// src/components/customers/BlockCustomerModal.jsx
import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const BlockCustomerModal = ({ customer, onClose, onConfirm, loading }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Please provide a reason for blocking this customer');
      return;
    }

    if (reason.trim().length < 10) {
      setError('Reason must be at least 10 characters long');
      return;
    }

    // ✅ FIXED: Pass only reason, parent component will handle ID
    onConfirm(reason.trim());
  };

  const commonReasons = [
    'Fraudulent activity detected',
    'Multiple payment failures',
    'Abusive behavior towards vendors',
    'Terms of service violation',
    'Suspicious account activity',
    'Repeated order cancellations',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Block Customer</h3>
              <p className="text-sm text-gray-500">This action will restrict customer access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">You are about to block:</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {customer?.name?.charAt(0).toUpperCase() || 'C'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{customer?.name || 'Unknown Customer'}</p>
                <p className="text-sm text-gray-500">{customer?.email || 'No email'}</p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800 mb-1">
                  Important Notice
                </p>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• Customer will not be able to place new orders</li>
                  <li>• Existing orders will not be affected</li>
                  <li>• Customer can still view order history</li>
                  <li>• This action can be reversed later</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Reasons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Select Reason
            </label>
            <div className="grid grid-cols-1 gap-2">
              {commonReasons.map((commonReason, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setReason(commonReason);
                    setError('');
                  }}
                  className={`text-left px-4 py-2 rounded-lg border transition-colors text-sm ${
                    reason === commonReason
                      ? 'border-red-600 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {commonReason}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Block Reason <span className="text-red-600">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              placeholder="Provide a detailed reason for blocking this customer..."
              rows="4"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Minimum 10 characters required
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !reason.trim()}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Blocking...
                </span>
              ) : (
                'Block Customer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlockCustomerModal;