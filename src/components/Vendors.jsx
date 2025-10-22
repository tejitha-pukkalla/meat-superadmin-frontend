import { useState, useEffect } from 'react';
import { vendorAPI } from '../api/api';
import { Store, Search, Plus, X, Edit2, Trash2, CheckCircle, XCircle, FileText, DollarSign } from 'lucide-react';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    fssaiLicense: '',
    meatCategories: [],
    commissionRate: 20
  });
  const [errors, setErrors] = useState({});

  const meatCategoryOptions = ['Chicken', 'Mutton', 'Fish', 'Seafood', 'Beef', 'Pork', 'Eggs'];

  useEffect(() => {
    fetchVendors();
  }, [searchTerm, statusFilter, currentPage]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await vendorAPI.getAllVendors({
        search: searchTerm,
        status: statusFilter,
        page: currentPage,
        limit: 10
      });
      setVendors(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      alert(error.response?.data?.message || 'Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number (10 digits, starting with 6-9)';
    }
    
    if (modalMode === 'create' && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (modalMode === 'create' && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Invalid pincode (6 digits)';
    }
    
    if (!formData.fssaiLicense.trim()) newErrors.fssaiLicense = 'FSSAI License is required';
    if (formData.meatCategories.length === 0) {
      newErrors.meatCategories = 'Select at least one meat category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (modalMode === 'create') {
        await vendorAPI.createVendor(formData);
        alert('Vendor created successfully!');
      } else {
        const updateData = { ...formData };
        delete updateData.password;
        await vendorAPI.updateVendor(selectedVendor._id, updateData);
        alert('Vendor updated successfully!');
      }
      
      setShowModal(false);
      resetForm();
      fetchVendors();
    } catch (error) {
      console.error('Error saving vendor:', error);
      alert(error.response?.data?.message || 'Failed to save vendor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vendorId, vendorName) => {
    if (!window.confirm(`Are you sure you want to delete ${vendorName}?`)) return;
    
    setLoading(true);
    try {
      await vendorAPI.deleteVendor(vendorId);
      alert('Vendor deleted successfully!');
      fetchVendors();
    } catch (error) {
      console.error('Error deleting vendor:', error);
      alert(error.response?.data?.message || 'Failed to delete vendor');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (vendorId, newStatus, vendorName) => {
    if (!window.confirm(`Change ${vendorName} status to ${newStatus}?`)) return;
    
    setLoading(true);
    try {
      await vendorAPI.updateVendorStatus(vendorId, newStatus);
      alert(`Vendor status updated to ${newStatus}!`);
      fetchVendors();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDocuments = async (vendorId, vendorName) => {
    if (!window.confirm(`Approve documents for ${vendorName}?`)) return;
    
    setLoading(true);
    try {
      await vendorAPI.approveDocuments(vendorId);
      alert('Documents approved successfully!');
      fetchVendors();
    } catch (error) {
      console.error('Error approving documents:', error);
      alert(error.response?.data?.message || 'Failed to approve documents');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyBanking = async (vendorId, vendorName) => {
    if (!window.confirm(`Verify banking details for ${vendorName}?`)) return;
    
    setLoading(true);
    try {
      await vendorAPI.verifyBanking(vendorId);
      alert('Banking details verified successfully!');
      fetchVendors();
    } catch (error) {
      console.error('Error verifying banking:', error);
      alert(error.response?.data?.message || 'Failed to verify banking');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (vendor) => {
    setModalMode('edit');
    setSelectedVendor(vendor);
    setFormData({
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      password: '',
      address: vendor.address,
      city: vendor.city,
      state: vendor.state,
      pincode: vendor.pincode,
      fssaiLicense: vendor.fssaiLicense,
      meatCategories: vendor.meatCategories,
      commissionRate: vendor.commissionRate
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      fssaiLicense: '',
      meatCategories: [],
      commissionRate: 20
    });
    setErrors({});
    setSelectedVendor(null);
  };

  const toggleMeatCategory = (category) => {
    setFormData(prev => ({
      ...prev,
      meatCategories: prev.meatCategories.includes(category)
        ? prev.meatCategories.filter(c => c !== category)
        : [...prev.meatCategories, category]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600 mt-1">Manage all vendors on the platform</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add New Vendor
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
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

      {/* Vendors Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-12">
            <Store size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No vendors found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verifications</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vendors.map((vendor) => (
                    <tr key={vendor._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{vendor.name}</div>
                          <div className="text-sm text-gray-500">{vendor.fssaiLicense}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">{vendor.email}</div>
                          <div className="text-gray-500">{vendor.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{vendor.city}, {vendor.state}</div>
                        <div className="text-sm text-gray-500">{vendor.pincode}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {vendor.meatCategories.map((cat, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ₹{vendor.commissionRate}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={vendor.status}
                          onChange={(e) => handleStatusChange(vendor._id, e.target.value, vendor.name)}
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(vendor.status)} border-0 cursor-pointer`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveDocuments(vendor._id, vendor.name)}
                            disabled={vendor.documentsVerified}
                            className={`p-1.5 rounded ${vendor.documentsVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            title={vendor.documentsVerified ? 'Documents Verified' : 'Approve Documents'}
                          >
                            <FileText size={16} />
                          </button>
                          <button
                            onClick={() => handleVerifyBanking(vendor._id, vendor.name)}
                            disabled={vendor.bankingVerified}
                            className={`p-1.5 rounded ${vendor.bankingVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            title={vendor.bankingVerified ? 'Banking Verified' : 'Verify Banking'}
                          >
                            <DollarSign size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(vendor)}
                            className="p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            title="Edit Vendor"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(vendor._id, vendor.name)}
                            className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            title="Delete Vendor"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === 'create' ? 'Add New Vendor' : 'Edit Vendor'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={modalMode === 'edit'}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${errors.email ? 'border-red-500' : 'border-gray-300'} ${modalMode === 'edit' ? 'bg-gray-100' : ''}`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="10-digit number"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                {modalMode === 'create' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Min 6 characters"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>
                )}

                {/* Address Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Address Information</h3>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                    placeholder="6-digit pincode"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
                </div>

                {/* Business Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Business Information</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">FSSAI License *</label>
                  <input
                    type="text"
                    value={formData.fssaiLicense}
                    onChange={(e) => setFormData({...formData, fssaiLicense: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${errors.fssaiLicense ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.fssaiLicense && <p className="mt-1 text-sm text-red-600">{errors.fssaiLicense}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (₹) *</label>
                  <input
                    type="number"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({...formData, commissionRate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Meat Categories *</label>
                  <div className="flex flex-wrap gap-3">
                    {meatCategoryOptions.map((category) => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.meatCategories.includes(category)}
                          onChange={() => toggleMeatCategory(category)}
                          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                  {errors.meatCategories && <p className="mt-2 text-sm text-red-600">{errors.meatCategories}</p>}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : modalMode === 'create' ? 'Create Vendor' : 'Update Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;