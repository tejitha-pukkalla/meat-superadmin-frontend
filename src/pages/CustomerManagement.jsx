// src/pages/CustomerManagement.jsx
import { useState, useEffect } from 'react';
import { Plus, Users } from 'lucide-react';
import CustomerStats from '../components/customers/CustomerStats';
import CustomerFilters from '../components/customers/CustomerFilters';
import CustomerTable from '../components/customers/CustomerTable';
import BlockCustomerModal from '../components/customers/BlockCustomerModal';
import ActivityLogModal from '../components/customers/ActivityLogModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import superAdminApi from '../utils/superAdminApi';
import { useNavigate } from 'react-router-dom';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ 
    search: '', 
    status: '', 
    page: 1, 
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({ totalPages: 1, page: 1, totalCustomers: 0 });
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [customerToBlock, setCustomerToBlock] = useState(null);
  const [activityModal, setActivityModal] = useState({ 
    isOpen: false, 
    customer: null, 
    log: [], 
    loading: false 
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCustomersAndStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch stats
      const statsRes = await superAdminApi.fetchCustomerStats();
      console.log('Stats Response:', statsRes);
      setStats(statsRes.data || statsRes.data?.data || {});

      // Fetch customers
      const customersRes = await superAdminApi.fetchCustomers(filters);
      console.log('Customers Response:', customersRes);
      
      // Handle different response structures
      const customersData = customersRes.data?.data?.customers || customersRes.data?.customers || [];
      const paginationData = customersRes.data?.data?.pagination || customersRes.data?.pagination || {};
      
      setCustomers(customersData);
      setPagination(paginationData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomersAndStats();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleViewCustomer = (customer) => {
    navigate(`/customers/${customer._id}`);
  };

  const handleOpenBlockModal = (customer) => {
    setCustomerToBlock(customer);
    setIsBlockModalOpen(true);
  };

  // ✅ FIXED: Correct parameter handling
  const handleBlockCustomer = async (reason) => {
    if (!customerToBlock) return;
    
    try {
      setLoading(true);
      await superAdminApi.blockCustomer(customerToBlock._id, reason);
      setIsBlockModalOpen(false);
      setCustomerToBlock(null);
      // Refetch data to update the table status
      await fetchCustomersAndStats(); 
      alert('Customer blocked successfully!');
    } catch (err) {
      console.error('Error blocking customer:', err);
      alert(`Failed to block customer: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to unblock this customer?")) return;
    try {
      setLoading(true);
      await superAdminApi.unblockCustomer(id);
      await fetchCustomersAndStats();
      alert('Customer unblocked successfully!');
    } catch (err) {
      console.error('Error unblocking customer:', err);
      alert(`Failed to unblock customer: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewActivity = async (customer) => {
    setActivityModal({ isOpen: true, customer, log: [], loading: true });
    try {
        const res = await superAdminApi.fetchCustomerActivity(customer._id);
        setActivityModal(prev => ({ 
          ...prev, 
          log: res.data?.data || res.data || [], 
          loading: false 
        }));
    } catch (err) {
        console.error('Error fetching activity:', err);
        setActivityModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleResetFilters = () => {
    setFilters({ 
      search: '', 
      status: '', 
      page: 1, 
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  if (error && !loading) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-semibold">Error: {error}</p>
          <button 
            onClick={fetchCustomersAndStats}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users size={28} className="text-red-600" /> Customer Management
        </h1>
        <button 
          onClick={() => alert('Add New Customer feature coming soon')}
          className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <Plus size={20} /> Add Customer
        </button>
      </div>

      <CustomerStats stats={stats} loading={loading} />

      <CustomerFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onSearch={fetchCustomersAndStats} 
        onReset={handleResetFilters} 
      />

      {loading && customers.length === 0 ? (
        <div className="flex justify-center h-60 items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <CustomerTable 
          customers={customers}
          pagination={pagination}
          onPageChange={handlePageChange}
          onView={handleViewCustomer}
          onBlock={handleOpenBlockModal}
          onUnblock={handleUnblockCustomer}
        />
      )}

      {isBlockModalOpen && customerToBlock && (
        <BlockCustomerModal 
          customer={customerToBlock} 
          onClose={() => {
            setIsBlockModalOpen(false);
            setCustomerToBlock(null);
          }} 
          onConfirm={handleBlockCustomer}
          loading={loading}
        />
      )}

      {activityModal.isOpen && (
        <ActivityLogModal
            customer={activityModal.customer}
            log={activityModal.log}
            onClose={() => setActivityModal({ isOpen: false, customer: null, log: [], loading: false })}
            loading={activityModal.loading}
        />
      )}
    </div>
  );
};

export default CustomerManagement;