import { useState, useEffect } from 'react';
import { categoryAPI } from '../../api/categoryAPI';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  Image as ImageIcon,
  Layers
} from 'lucide-react';
import CategoryForm from './CategoryForm';
import { useNavigate } from 'react-router-dom';

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 25
  });

  useEffect(() => {
    fetchCategories();
  }, [searchTerm, statusFilter, currentPage]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 25,
        sort_by: 'display_order',
        sort_order: 'asc'
      };

      // Only add search if it has a value
      if (searchTerm.trim()) {
        params.search = searchTerm;
      }

      // Only add is_active if a specific status is selected
      if (statusFilter !== '') {
        params.is_active = statusFilter === 'true';
      }

      console.log('Fetching categories with params:', params);

      const response = await categoryAPI.getAllCategories(params);
      console.log('Categories response:', response.data);
      setCategories(response.data.data.categories);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert(error.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"?`)) return;

    setLoading(true);
    try {
      await categoryAPI.deleteCategory(categoryId, false);
      alert('Category deactivated successfully!');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error.response?.data?.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (categoryId, currentStatus) => {
    setLoading(true);
    try {
      await categoryAPI.bulkUpdateStatus({
        category_ids: [categoryId],
        is_active: !currentStatus
      });
      alert('Category status updated!');
      fetchCategories();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedCategory(null);
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleFormSuccess = () => {
    setShowModal(false);
    setSelectedCategory(null);
    fetchCategories();
  };

  const handleViewSubcategories = (categoryId) => {
    navigate(`/subcategories?category=${categoryId}`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600 mt-1">Manage all product categories</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No categories found</p>
          <button
            onClick={openCreateModal}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Create First Category
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Category Image */}
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {category.category_image?.url ? (
                    <img
                      src={category.category_image.url}
                      alt={category.category_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={48} className="text-gray-400" />
                  )}
                </div>

                {/* Category Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.category_name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        category.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {category.category_description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {category.category_description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Order: {category.display_order}</span>
                    <span className="flex items-center gap-1">
                      Products: {category.product_count || 0}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => handleToggleStatus(category._id, category.is_active)}
                      className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                        category.is_active
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {category.is_active ? (
                        <>
                          <EyeOff size={16} />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Eye size={16} />
                          Activate
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => openEditModal(category)}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id, category.category_name)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* View Subcategories Button */}
                  <button
                    onClick={() => handleViewSubcategories(category._id)}
                    className="w-full mt-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Layers size={16} />
                    Manage Subcategories
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * pagination.items_per_page) + 1} to{' '}
              {Math.min(currentPage * pagination.items_per_page, pagination.total_items)} of{' '}
              {pagination.total_items} categories
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-gray-100 rounded-lg">
                Page {currentPage} of {pagination.total_pages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(pagination.total_pages, prev + 1))}
                disabled={currentPage === pagination.total_pages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <CategoryForm
          mode={modalMode}
          category={selectedCategory}
          onClose={() => setShowModal(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default CategoryList;