// src/pages/CustomerDetails.jsx
import { useParams, Link } from 'react-router-dom';
import { User, Mail, Phone, ShoppingBag, DollarSign, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
// import useSuperAdminApi from '../utils/useSuperAdminApi'; // Custom hook for API calls

const CustomerDetails = () => {
  const { id } = useParams();
  // const { data: customer, loading, error, refetch } = useSuperAdminApi(`/customers/${id}`);

  // MOCK DATA for demonstration
  const loading = false;
  const error = null;
  const customer = {
    _id: id,
    name: 'Ravi Teja',
    email: 'ravi.teja@example.com',
    phone: '9876543210',
    status: 'Active',
    createdAt: '2023-01-15T10:00:00Z',
    totalOrders: 42,
    totalSpending: 154320.50,
    lastOrderDate: '2024-10-20T12:30:00Z',
  };
  
  if (loading) return <div className="p-8"><LoadingSpinner /></div>;
  if (error) return <div className="p-8 text-red-600">Error: {error.message}</div>;
  if (!customer) return <div className="p-8 text-gray-600">Customer not found.</div>;

  const formatDate = (date) => new Date(date).toLocaleString();

  return (
    <div className="p-8">
      <Link to="/customers" className="flex items-center gap-2 text-red-600 hover:text-red-700 mb-6 font-medium">
        <ArrowLeft size={20} /> Back to Customer Management
      </Link>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-start border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{customer.name}'s Profile</h1>
          <StatusBadge status={customer.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Contact Information</h2>
            <div className="flex items-center gap-3 text-lg text-gray-700"><Mail size={20} className="text-blue-500" /> <span className="font-medium">Email:</span> {customer.email}</div>
            <div className="flex items-center gap-3 text-lg text-gray-700"><Phone size={20} className="text-blue-500" /> <span className="font-medium">Phone:</span> {customer.phone}</div>
            <div className="flex items-center gap-3 text-lg text-gray-700"><span className="font-medium">Member Since:</span> {formatDate(customer.createdAt)}</div>
          </div>

          {/* Statistics */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Activity Statistics</h2>
            <div className="flex items-center gap-3 text-lg text-gray-700"><ShoppingBag size={20} className="text-green-500" /> <span className="font-medium">Total Orders:</span> {customer.totalOrders}</div>
            <div className="flex items-center gap-3 text-lg text-gray-700"><DollarSign size={20} className="text-green-500" /> <span className="font-medium">Total Spending:</span> ₹{customer.totalSpending.toFixed(2)}</div>
            <div className="flex items-center gap-3 text-lg text-gray-700"><span className="font-medium">Last Activity:</span> {formatDate(customer.lastOrderDate)}</div>
          </div>
        </div>
        
        {/* Additional Sections (e.g., Activity Log, Order History) */}
        <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Activity and Orders</h2>
            <p className="text-gray-500">
                (Content for ActivityLogModal and other relevant data tables would be rendered here.)
            </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;