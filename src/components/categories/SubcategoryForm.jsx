import { useState, useEffect } from 'react';
import { subcategoryAPI } from '../../api/categoryAPI';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

const SubcategoryForm = ({ mode, subcategory, categories, defaultCategoryId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    parent_category_id: defaultCategoryId || '',
    subcategory_name: '',
    subcategory_description: '',
    display_order: 0,
    meta_title: '',
    meta_description: '',
    is_active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && subcategory) {
      setFormData({
        parent_category_id: subcategory.parent_category_id?._id || subcategory.parent_category_id || '',
        subcategory_name: subcategory.subcategory_name || '',
        subcategory_description: subcategory.subcategory_description || '',
        display_order: subcategory.display_order || 0,
        meta_title: subcategory.meta_title || '',
        meta_description: subcategory.meta_description || '',
        is_active: subcategory.is_active !== undefined ? subcategory.is_active : true
      });
      
      if (subcategory.subcategory_image?.url) {
        setImagePreview(subcategory.subcategory_image.url);
      }
    } else if (mode === 'create' && defaultCategoryId) {
      // Pre-fill category when creating from category list
      setFormData(prev => ({
        ...prev,
        parent_category_id: defaultCategoryId
      }));
    }
  }, [mode, subcategory, defaultCategoryId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.parent_category_id) {
      newErrors.parent_category_id = 'Parent category is required';
    }

    if (!formData.subcategory_name.trim()) {
      newErrors.subcategory_name = 'Subcategory name is required';
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
      
      submitData.append('parent_category_id', formData.parent_category_id);
      submitData.append('subcategory_name', formData.subcategory_name.trim());
      submitData.append('subcategory_description', formData.subcategory_description.trim());
      submitData.append('display_order', formData.display_order);
      submitData.append('meta_title', formData.meta_title.trim());
      submitData.append('meta_description', formData.meta_description.trim());
      submitData.append('is_active', formData.is_active);

      if (imageFile) {
        submitData.append('subcategory_image', imageFile);
      }

      if (mode === 'create') {
        await subcategoryAPI.createSubcategory(submitData);
        alert('Subcategory created successfully!');
      } else {
        await subcategoryAPI.updateSubcategory(subcategory._id, submitData);
        alert('Subcategory updated successfully!');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving subcategory:', error);
      alert(error.response?.data?.message || 'Failed to save subcategory');
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
            {mode === 'create' ? 'Create New Subcategory' : 'Edit Subcategory'}
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
          {/* Parent Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Category *
            </label>
            <select
              value={formData.parent_category_id}
              onChange={(e) => setFormData({ ...formData, parent_category_id: e.target.value })}
              disabled={mode === 'edit'}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                errors.parent_category_id ? 'border-red-500' : 'border-gray-300'
              } ${mode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
              <option value="">Select Parent Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category_name}
                </option>
              ))}
            </select>
            {errors.parent_category_id && (
              <p className="mt-1 text-sm text-red-600">{errors.parent_category_id}</p>
            )}
          </div>

          {/* Subcategory Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory Image
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

          {/* Subcategory Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory Name *
            </label>
            <input
              type="text"
              value={formData.subcategory_name}
              onChange={(e) => setFormData({ ...formData, subcategory_name: e.target.value })}
              placeholder="e.g., Boneless, Curry Cut, Whole"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                errors.subcategory_name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.subcategory_name && (
              <p className="mt-1 text-sm text-red-600">{errors.subcategory_name}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.subcategory_description}
              onChange={(e) => setFormData({ ...formData, subcategory_description: e.target.value })}
              rows={3}
              placeholder="Brief description of the subcategory"
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
              {loading ? 'Saving...' : mode === 'create' ? 'Create Subcategory' : 'Update Subcategory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubcategoryForm;