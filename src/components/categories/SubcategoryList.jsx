import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { subcategoryAPI, publicCategoryAPI } from '../../api/categoryAPI';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  Image as ImageIcon,
  ArrowLeft
} from 'lucide-react';
import SubcategoryForm from './SubcategoryForm';

const SubcategoryList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryIdFromUrl = searchParams.get('category');
  
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(categoryIdFromUrl || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 25
  });

  useEffect(() => {
    fetchActiveCategories();
  }, []);

  useEffect(() => {
    // Update filter when URL param changes
    if (categoryIdFromUrl) {
      setCategoryFilter(categoryIdFromUrl);
    }
  }, [categoryIdFromUrl]);

  useEffect(() => {
    fetchSubcategories();
  }, [searchTerm, categoryFilter, statusFilter, currentPage]);

  const fetchActiveCategories = async () => {
    try {
      const response = await publicCategoryAPI.getActiveCategories();
      console.log('Categories response:', response.data);
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async () => {
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

      // Only add parent_category_id if a specific category is selected
      if (categoryFilter) {
        params.parent_category_id = categoryFilter;
      }

      // FIXED: Only add is_active if a specific status is selected
      if (statusFilter !== '') {
        params.is_active = statusFilter;
      }
      // If statusFilter is empty, don't include is_active parameter at all

      console.log('Fetching subcategories with params:', params); // Debug log

      const response = await subcategoryAPI.getAllSubcategories(params);
      console.log('Subcategories response:', response.data);
      setSubcategories(response.data.data.subcategories);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      alert(error.response?.data?.message || 'Failed to fetch subcategories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subcategoryId, subcategoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${subcategoryName}"?`)) return;

    setLoading(true);
    try {
      await subcategoryAPI.deleteSubcategory(subcategoryId, false);
      alert('Subcategory deactivated successfully!');
      fetchSubcategories();
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      alert(error.response?.data?.message || 'Failed to delete subcategory');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (subcategoryId, currentStatus) => {
    setLoading(true);
    try {
      await subcategoryAPI.bulkUpdateStatus({
        subcategory_ids: [subcategoryId],
        is_active: !currentStatus
      });
      alert('Subcategory status updated!');
      fetchSubcategories();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedSubcategory(null);
    setShowModal(true);
  };

  const openEditModal = (subcategory) => {
    setModalMode('edit');
    setSelectedSubcategory(subcategory);
    setShowModal(true);
  };

  const handleFormSuccess = () => {
    setShowModal(false);
    fetchSubcategories();
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    return category?.category_name || 'Unknown';
  };

  const getSelectedCategoryName = () => {
    if (!categoryFilter) return 'All Categories';
    const category = categories.find(c => c._id === categoryFilter);
    return category?.category_name || 'Selected Category';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => navigate('/categories')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Subcategory Management
              {categoryFilter && ` - ${getSelectedCategoryName()}`}
            </h1>
          </div>
          <p className="text-gray-600">
            {categoryFilter 
              ? `Manage subcategories for ${getSelectedCategoryName()}` 
              : 'Manage all product subcategories'}
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Subcategory
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search subcategories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category_name}
              </option>
            ))}
          </select>
          
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
              setCategoryFilter('');
              setStatusFilter('');
              setCurrentPage(1);
              navigate('/subcategories'); // Clear URL params
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Subcategories Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : subcategories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">
            {categoryFilter 
              ? `No subcategories found for ${getSelectedCategoryName()}` 
              : 'No subcategories found'}
          </p>
          <button
            onClick={openCreateModal}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Create First Subcategory
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
            {subcategories.map((subcategory) => (
              <div
                key={subcategory._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Subcategory Image */}
                <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {subcategory.subcategory_image?.url ? (
                    <img
                      src={subcategory.subcategory_image.url}
                      alt={subcategory.subcategory_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={40} className="text-gray-400" />
                  )}
                </div>

                {/* Subcategory Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        {subcategory.subcategory_name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {getCategoryName(subcategory.parent_category_id)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                        subcategory.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {subcategory.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {subcategory.subcategory_description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {subcategory.subcategory_description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Order: {subcategory.display_order}</span>
                    <span className="flex items-center gap-1">
                      Products: {subcategory.product_count || 0}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(subcategory._id, subcategory.is_active)}
                      className={`flex-1 px-2 py-2 rounded-lg flex items-center justify-center gap-1 text-xs transition-colors ${
                        subcategory.is_active
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {subcategory.is_active ? (
                        <>
                          <EyeOff size={14} />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye size={14} />
                          Show
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => openEditModal(subcategory)}
                      className="px-2 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(subcategory._id, subcategory.subcategory_name)}
                      className="px-2 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * pagination.items_per_page) + 1} to{' '}
              {Math.min(currentPage * pagination.items_per_page, pagination.total_items)} of{' '}
              {pagination.total_items} subcategories
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
        <SubcategoryForm
          mode={modalMode}
          subcategory={selectedSubcategory}
          categories={categories}
          defaultCategoryId={categoryFilter}
          onClose={() => setShowModal(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default SubcategoryList;