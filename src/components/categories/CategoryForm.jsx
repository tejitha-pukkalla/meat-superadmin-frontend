import { useState, useEffect } from 'react';
import { categoryAPI } from '../../api/categoryAPI';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

const CategoryForm = ({ mode, category, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    category_name: '',
    category_description: '',
    display_order: 0,
    meta_title: '',
    meta_description: '',
    is_active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && category) {
      setFormData({
        category_name: category.category_name || '',
        category_description: category.category_description || '',
        display_order: category.display_order || 0,
        meta_title: category.meta_title || '',
        meta_description: category.meta_description || '',
        is_active: category.is_active !== undefined ? category.is_active : true
      });
      
      if (category.category_image?.url) {
        setImagePreview(category.category_image.url);
      }
    }
  }, [mode, category]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category_name.trim()) {
      newErrors.category_name = 'Category name is required';
    }

    if (formData.display_order < 0) {
      newErrors.display_order = 'Display order must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = new FormData();
      
      submitData.append('category_name', formData.category_name.trim());
      submitData.append('category_description', formData.category_description.trim());
      submitData.append('display_order', formData.display_order);
      submitData.append('meta_title', formData.meta_title.trim());
      submitData.append('meta_description', formData.meta_description.trim());
      submitData.append('is_active', formData.is_active);

      if (imageFile) {
        submitData.append('category_image', imageFile);
      }

      if (mode === 'create') {
        await categoryAPI.createCategory(submitData);
        alert('Category created successfully!');
      } else {
        await categoryAPI.updateCategory(category._id, submitData);
        alert('Category updated successfully!');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving category:', error);
      alert(error.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'create' ? 'Create New Category' : 'Edit Category'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Category Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image
            </label>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <ImageIcon size={32} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                  <Upload size={20} />
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Category Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={formData.category_name}
              onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
              placeholder="e.g., Chicken, Fish, Mutton"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                errors.category_name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.category_name && (
              <p className="mt-1 text-sm text-red-600">{errors.category_name}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.category_description}
              onChange={(e) => setFormData({ ...formData, category_description: e.target.value })}
              rows={3}
              placeholder="Brief description of the category"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Display Order */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              min="0"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                errors.display_order ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.display_order && (
              <p className="mt-1 text-sm text-red-600">{errors.display_order}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Lower numbers appear first
            </p>
          </div>

          {/* SEO Section */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              SEO Settings (Optional)
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                placeholder="SEO friendly title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                rows={2}
                placeholder="SEO friendly description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Active (visible to vendors)
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Create Category' : 'Update Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;