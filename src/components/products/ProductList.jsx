import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Eye, Edit, Power, 
  Star, Package, TrendingUp, AlertCircle,
  Download, RefreshCw
} from 'lucide-react';
import Badge from '../common/Badge';
import { superAdminApiCall } from '../../utils/superAdminApi';

const ProductList = ({ onView, onEdit, onDeactivate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    vendor_id: '',
    category_id: '',
    subcategory_id: '',
    is_active: '',
    stock_status: '',
    min_price: '',
    max_price: '',
    min_rating: '',
    date_from: '',
    date_to: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 20;

  // Dropdown data
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchVendors();
    fetchCategories();
  }, [currentPage, searchTerm, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        )
      }).toString();

      const response = await superAdminApiCall(`/super-admin/products?${params}`);
      
      if (response.success) {
        setProducts(response.data.products || []);
        setTotalPages(response.data.pagination?.total_pages || 1);
        setTotalProducts(response.data.pagination?.total_items || 0);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await superAdminApiCall('/super-admin/vendors?limit=100');
      if (response.success) {
        setVendors(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await superAdminApiCall('/category?is_active=true&limit=100');
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    
    try {
      const response = await superAdminApiCall(
        `/subcategories?category_id=${categoryId}&is_active=true&limit=100`
      );
      if (response.success) {
        setSubcategories(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
      setSubcategories([]);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
    
    if (field === 'category_id') {
      fetchSubcategories(value);
      setFilters(prev => ({ ...prev, subcategory_id: '' }));
    }
  };

  const handleClearFilters = () => {
    setFilters({
      vendor_id: '',
      category_id: '',
      subcategory_id: '',
      is_active: '',
      stock_status: '',
      min_price: '',
      max_price: '',
      min_rating: '',
      date_from: '',
      date_to: ''
    });
    setSearchTerm('');
    setSubcategories([]);
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p._id));
    }
  };

  const getStockStatus = (product) => {
    const totalStock = product.total_stock || 0;
    if (totalStock === 0) return { label: 'Out of Stock', variant: 'danger' };
    if (totalStock < 20) return { label: 'Low Stock', variant: 'warning' };
    return { label: 'In Stock', variant: 'success' };
  };

  const getRatingBadge = (rating) => {
    if (!rating || rating === 0) return null;
    const variant = rating >= 4 ? 'success' : rating >= 3 ? 'warning' : 'danger';
    return (
      <div className="flex items-center gap-1">
        <Star size={12} className="fill-yellow-400 text-yellow-400" />
        <span className={`text-sm font-medium ${
          variant === 'success' ? 'text-green-600' : 
          variant === 'warning' ? 'text-yellow-600' : 
          'text-red-600'
        }`}>
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const exportToCSV = async () => {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        )
      }).toString();

      const token = localStorage.getItem('superAdminToken');
      const response = await fetch(
        `http://localhost:4000/api/super-admin/products/export?${params}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      alert('Products exported successfully!');
    } catch (error) {
      console.error('Failed to export:', error);
      alert('Failed to export products. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Package size={24} className="text-red-600" />
              All Products
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Monitor and manage all vendor products
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{totalProducts}</div>
          <div className="text-sm text-gray-600">Total Products</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {products.filter(p => p.is_active).length}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {products.filter(p => p.total_stock < 20 && p.total_stock > 0).length}
          </div>
          <div className="text-sm text-gray-600">Low Stock</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {products.filter(p => p.total_stock === 0).length}
          </div>
          <div className="text-sm text-gray-600">Out of Stock</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by product name, SKU, or vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors ${
              showFilters ? 'bg-gray-50' : ''
            }`}
          >
            <Filter size={16} />
            Filters
            {Object.values(filters).some(v => v !== '') && (
              <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">
                {Object.values(filters).filter(v => v !== '').length}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg border space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Vendor Filter */}
              <select
                value={filters.vendor_id}
                onChange={(e) => handleFilterChange('vendor_id', e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Vendors</option>
                {vendors.map(vendor => (
                  <option key={vendor._id} value={vendor._id}>
                    {vendor.name || vendor.shopName}
                  </option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={filters.category_id}
                onChange={(e) => handleFilterChange('category_id', e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>

              {/* Subcategory Filter */}
              <select
                value={filters.subcategory_id}
                onChange={(e) => handleFilterChange('subcategory_id', e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={!filters.category_id}
              >
                <option value="">All Subcategories</option>
                {subcategories.map(subcat => (
                  <option key={subcat._id} value={subcat._id}>
                    {subcat.subcategory_name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filters.is_active}
                onChange={(e) => handleFilterChange('is_active', e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              {/* Stock Status Filter */}
              <select
                value={filters.stock_status}
                onChange={(e) => handleFilterChange('stock_status', e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Stock Status</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>

              {/* Price Range */}
              <input
                type="number"
                placeholder="Min Price"
                value={filters.min_price}
                onChange={(e) => handleFilterChange('min_price', e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.max_price}
                onChange={(e) => handleFilterChange('max_price', e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              {/* Rating Filter */}
              <select
                value={filters.min_rating}
                onChange={(e) => handleFilterChange('min_rating', e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>

              {/* Date Range */}
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="text-gray-600 mt-2">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-y">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Vendor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Rating
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.primary_image || 'https://via.placeholder.com/60'}
                          alt={product.product_name}
                          className="w-12 h-12 rounded object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/60?text=No+Image';
                          }}
                        />
                        <div>
                          <div className="font-medium text-gray-800">
                            {product.product_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            SKU: {product.sku}
                          </div>
                          <div className="flex gap-1 mt-1">
                            {product.is_featured && (
                              <Badge variant="info" size="sm">Featured</Badge>
                            )}
                            {product.is_bestseller && (
                              <Badge variant="warning" size="sm">Bestseller</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-800">
                        {product.created_by?.shopName || product.created_by?.name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.created_by?.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-800">
                        {product.category_id?.category_name}
                      </div>
                      {product.subcategory_id && (
                        <div className="text-xs text-gray-500">
                          {product.subcategory_id.subcategory_name}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-semibold text-gray-800">
                        ₹{product.min_price}
                        {product.max_price > product.min_price && 
                          ` - ₹${product.max_price}`
                        }
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.variants?.length || 0} variant(s)
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.label}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        Qty: {product.total_stock || 0}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={product.is_active ? 'success' : 'danger'}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {getRatingBadge(product.rating)}
                      <div className="text-xs text-gray-500 mt-1">
                        {product.total_orders || 0} orders
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onView(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDeactivate(product)}
                          className={`p-2 rounded transition-colors ${
                            product.is_active
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={product.is_active ? 'Deactivate' : 'Activate'}
                        >
                          <Power size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && products.length > 0 && (
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, totalProducts)} of{' '}
            {totalProducts} products
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-red-600 text-white'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;