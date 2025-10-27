import React, { useState, useEffect } from 'react';
import {
  X, Package, User, Tag, TrendingUp, AlertCircle,
  Star, ShoppingCart, Calendar, MapPin, Image as ImageIcon
} from 'lucide-react';
import Badge from '../common/Badge';
import { superAdminApiCall } from '../../utils/superAdminApi';

const ProductDetailsView = ({ productId, isOpen, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); 
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (isOpen && productId) {
      fetchProductDetails();
    }
  }, [isOpen, productId]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await superAdminApiCall(`/super-admin/products/${productId}`);
      if (response.success) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch product details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : product ? (
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Product Header */}
            <div className="p-6 bg-gray-50 border-b">
              <div className="flex gap-6">
                {/* Image Gallery */}
                <div className="w-1/3">
                  <div className="bg-white rounded-lg p-4 border">
                    <img
                      src={product.images?.[selectedImage]?.image_url || 'https://via.placeholder.com/400'}
                      alt={product.product_name}
                      className="w-full h-80 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400?text=No+Image';
                      }}
                    />
                    <div className="flex gap-2 mt-4 overflow-x-auto">
                      {product.images?.map((img, idx) => (
                        <img
                          key={idx}
                          src={img.image_url}
                          alt={`${product.product_name} ${idx + 1}`}
                          className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                            selectedImage === idx ? 'border-red-600' : 'border-gray-200'
                          }`}
                          onClick={() => setSelectedImage(idx)}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/60';
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {product.product_name}
                      </h3>
                      <div className="flex gap-2 mb-3">
                        {product.is_featured && <Badge variant="info">Featured</Badge>}
                        {product.is_bestseller && <Badge variant="warning">Bestseller</Badge>}
                        {product.is_new_arrival && <Badge variant="success">New Arrival</Badge>}
                        <Badge variant={product.is_active ? 'success' : 'danger'}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-red-600">
                        ₹{product.min_price}
                        {product.max_price > product.min_price && ` - ₹${product.max_price}`}
                      </div>
                      {product.rating > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <Star size={16} className="fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{product.rating.toFixed(1)}</span>
                          <span className="text-gray-500 text-sm">
                            ({product.total_orders || 0} orders)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <Package size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">SKU</span>
                      </div>
                      <div className="font-semibold text-gray-800">{product.sku}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <Tag size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">Category</span>
                      </div>
                      <div className="font-semibold text-gray-800">
                        {product.category_id?.category_name}
                        {product.subcategory_id && (
                          <span className="text-gray-500 text-sm">
                            {' > '}{product.subcategory_id.subcategory_name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <User size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">Vendor</span>
                      </div>
                      <div className="font-semibold text-gray-800">
                        {product.created_by?.shopName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.created_by?.email}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">Origin</span>
                      </div>
                      <div className="font-semibold text-gray-800">
                        {product.country_of_origin || 'India'}
                      </div>
                    </div>
                  </div>

                  {/* Short Description */}
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                    <p className="text-gray-600 text-sm">
                      {product.short_description || 'No description available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <div className="flex gap-4 px-6">
                {['overview', 'analytics', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 font-medium capitalize border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Variants */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Product Variants</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.variants?.map((variant) => (
                        <div key={variant._id} className="bg-gray-50 p-4 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-gray-800">
                              {variant.variant_name}
                            </div>
                            <Badge
                              variant={
                                variant.stock_quantity === 0
                                  ? 'danger'
                                  : variant.stock_quantity <= variant.low_stock_threshold
                                  ? 'warning'
                                  : 'success'
                              }
                            >
                              Stock: {variant.stock_quantity}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Weight:</span>
                              <span className="ml-2 font-medium">
                                {variant.weight}{variant.weight_unit}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">MRP:</span>
                              <span className="ml-2 font-medium">₹{variant.mrp}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Price:</span>
                              <span className="ml-2 font-medium text-red-600">
                                ₹{variant.selling_price}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Discount:</span>
                              <span className="ml-2 font-medium text-green-600">
                                {variant.discount_percentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Description */}
                  {product.long_description && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Detailed Description</h4>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-gray-600 text-sm whitespace-pre-line">
                          {product.long_description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Instructions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.preparation_instructions && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Preparation Instructions
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <p className="text-gray-600 text-sm">
                            {product.preparation_instructions}
                          </p>
                        </div>
                      </div>
                    )}
                    {product.storage_instructions && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Storage Instructions
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <p className="text-gray-600 text-sm">
                            {product.storage_instructions}
                          </p>
                        </div>
                      </div>
                    )}
                    {product.cooking_instructions && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Cooking Instructions
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <p className="text-gray-600 text-sm">
                            {product.cooking_instructions}
                          </p>
                        </div>
                      </div>
                    )}
                    {product.shelf_life && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Shelf Life</h4>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <p className="text-gray-600 text-sm">{product.shelf_life}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Nutrition Info */}
                  {product.nutrition && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Nutrition Information
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {product.nutrition.serving_size && (
                            <div>
                              <div className="text-sm text-gray-600">Serving Size</div>
                              <div className="font-semibold text-gray-800">
                                {product.nutrition.serving_size}
                              </div>
                            </div>
                          )}
                          {product.nutrition.calories && (
                            <div>
                              <div className="text-sm text-gray-600">Calories</div>
                              <div className="font-semibold text-gray-800">
                                {product.nutrition.calories} kcal
                              </div>
                            </div>
                          )}
                          {product.nutrition.protein && (
                            <div>
                              <div className="text-sm text-gray-600">Protein</div>
                              <div className="font-semibold text-gray-800">
                                {product.nutrition.protein}g
                              </div>
                            </div>
                          )}
                          {product.nutrition.carbohydrates && (
                            <div>
                              <div className="text-sm text-gray-600">Carbs</div>
                              <div className="font-semibold text-gray-800">
                                {product.nutrition.carbohydrates}g
                              </div>
                            </div>
                          )}
                          {product.nutrition.fat && (
                            <div>
                              <div className="text-sm text-gray-600">Fat</div>
                              <div className="font-semibold text-gray-800">
                                {product.nutrition.fat}g
                              </div>
                            </div>
                          )}
                          {product.nutrition.fiber && (
                            <div>
                              <div className="text-sm text-gray-600">Fiber</div>
                              <div className="font-semibold text-gray-800">
                                {product.nutrition.fiber}g
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <ShoppingCart size={20} className="text-blue-600" />
                        <span className="text-sm text-blue-700">Total Orders</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-900">
                        {product.total_orders || 0}
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={20} className="text-green-600" />
                        <span className="text-sm text-green-700">Total Revenue</span>
                      </div>
                      <div className="text-2xl font-bold text-green-900">
                        ₹{product.total_revenue || 0}
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Star size={20} className="text-yellow-600" />
                        <span className="text-sm text-yellow-700">Avg Rating</span>
                      </div>
                      <div className="text-2xl font-bold text-yellow-900">
                        {product.rating?.toFixed(1) || '0.0'}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Package size={20} className="text-purple-600" />
                        <span className="text-sm text-purple-700">Total Stock</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-900">
                        {product.total_stock || 0}
                      </div>
                    </div>
                  </div>

                  {/* Pricing History */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Pricing History</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="text-gray-600 text-sm">
                        Pricing analytics will be displayed here
                      </p>
                    </div>
                  </div>

                  {/* Stock History */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Stock History</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="text-gray-600 text-sm">
                        Stock movement analytics will be displayed here
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800">Customer Reviews</h4>
                    <div className="flex items-center gap-2">
                      <Star size={20} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-xl font-bold">
                        {product.rating?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-gray-500">
                        ({product.total_reviews || 0} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-8 rounded-lg border text-center">
                    <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Customer reviews will be displayed here</p>
                  </div>
                </div>
              )}
            </div>

            {/* Metadata Footer */}
            <div className="p-6 bg-gray-50 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(product.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>{' '}
                  {new Date(product.updatedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-600">Product not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsView;