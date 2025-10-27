import React, { useState } from 'react';
import ProductList from '../components/products/ProductList';
import ProductDetailsView from '../components/products/ProductDetailsView';
import EditProductModal from '../components/products/EditProductModal';
import ToggleProductStatusModal from '../components/products/ToggleProductStatusModal';

const ProductManagement = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showToggleStatusModal, setShowToggleStatusModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleToggleStatus = (product) => {
    setSelectedProduct(product);
    setShowToggleStatusModal(true);
  };

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    setSelectedProduct(null);
  };

  const handleCloseModals = () => {
    setShowDetailsModal(false);
    setShowEditModal(false);
    setShowToggleStatusModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <ProductList
          key={refreshTrigger}
          onView={handleViewProduct}
          onEdit={handleEditProduct}
          onDeactivate={handleToggleStatus}
        />

        {/* Product Details Modal */}
        {showDetailsModal && selectedProduct && (
          <ProductDetailsView
            productId={selectedProduct._id}
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
          />
        )}

        {/* Edit Product Modal */}
        {showEditModal && selectedProduct && (
          <EditProductModal
            product={selectedProduct}
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSuccess={handleSuccess}
          />
        )}

        {/* Toggle Product Status Modal */}
        {showToggleStatusModal && selectedProduct && (
          <ToggleProductStatusModal
            product={selectedProduct}
            isOpen={showToggleStatusModal}
            onClose={() => setShowToggleStatusModal(false)}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default ProductManagement;