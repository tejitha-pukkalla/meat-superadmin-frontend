import React, { useState } from 'react';
import { AlertTriangle, Power } from 'lucide-react';
import Modal from '../common/Modal';
import Alert from '../common/Alert';
import { superAdminApiCall } from '../../utils/superAdminApi';

const ToggleProductStatusModal = ({ product, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [reason, setReason] = useState('');

  const isActivating = !product?.is_active;

  const handleToggle = async () => {
    if (!isActivating && !reason.trim()) {
      setAlert({
        type: 'error',
        message: 'Please provide a reason for deactivation',
      });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const response = await superAdminApiCall(
        `/super-admin/products/${product._id}/toggle-status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            is_active: isActivating,
            reason: reason.trim(),
          }),
        }
      );

      if (response.success) {
        setAlert({
          type: 'success',
          message: `Product ${isActivating ? 'activated' : 'deactivated'} successfully!`,
        });
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message || `Failed to ${isActivating ? 'activate' : 'deactivate'} product`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${isActivating ? 'Activate' : 'Deactivate'} Product`} size="sm">
      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      <div className="mb-6">
        <div
          className={`flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full ${
            isActivating ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          {isActivating ? (
            <Power className="w-6 h-6 text-green-600" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-red-600" />
          )}
        </div>

        <p className="text-gray-700 mb-4 text-center">
          Are you sure you want to {isActivating ? 'activate' : 'deactivate'}{' '}
          <strong className="text-gray-900">{product?.product_name}</strong>?
        </p>

        {!isActivating && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Deactivation <span className="text-red-600">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Quality issues, pricing concerns, vendor request..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={3}
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              This reason will be logged and shared with the vendor.
            </p>
          </div>
        )}

        {isActivating && (
          <p className="text-sm text-gray-500 text-center">
            This product will be visible to customers and available for purchase.
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`flex-1 px-4 py-2 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isActivating
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {loading
            ? `${isActivating ? 'Activating' : 'Deactivating'}...`
            : `Yes, ${isActivating ? 'Activate' : 'Deactivate'}`}
        </button>
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default ToggleProductStatusModal;