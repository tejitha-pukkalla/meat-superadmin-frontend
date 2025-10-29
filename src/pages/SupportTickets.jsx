// src/pages/SupportTickets.jsx
import { useState, useEffect } from 'react';
import { Plus, LifeBuoy } from 'lucide-react';
import TicketStats from '../components/support/TicketStats';
import TicketFilters from '../components/support/TicketFilters';
import TicketTable from '../components/support/TicketTable';
import CreateTicketModal from '../components/support/CreateTicketModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import superAdminApi from '../utils/superAdminApi';
import { useNavigate } from 'react-router-dom';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ 
    search: '', 
    status: '', 
    priority: '', 
    issueType: '',
    page: 1, 
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({ totalPages: 1, page: 1, totalTickets: 0 });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTicketsAndStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch stats
      const statsRes = await superAdminApi.fetchTicketStats();
      console.log('Ticket Stats Response:', statsRes);
      setStats(statsRes.data || statsRes.data?.data || {});

      // Fetch tickets
      const ticketsRes = await superAdminApi.fetchTickets(filters);
      console.log('Tickets Response:', ticketsRes);
      
      // Handle different response structures
      const ticketsData = ticketsRes.data?.data?.tickets || ticketsRes.data?.tickets || [];
      const paginationData = ticketsRes.data?.data?.pagination || ticketsRes.data?.pagination || {};
      
      // ✅ Map customer data properly
      const mappedTickets = ticketsData.map(ticket => ({
        ...ticket,
        customerName: ticket.customer?.name || 'Unknown',
        customerEmail: ticket.customer?.email || 'N/A',
        assignedToName: ticket.assignedTo?.name || 'Unassigned'
      }));
      
      setTickets(mappedTickets);
      setPagination(paginationData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketsAndStats();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleViewTicket = (ticket) => {
    navigate(`/support-tickets/${ticket._id}`);
  };

  const handleCreateTicket = async (ticketData) => {
    try {
      setLoading(true);
      await superAdminApi.createTicket(ticketData);
      setIsCreateModalOpen(false);
      // Refetch data to update the table
      await fetchTicketsAndStats(); 
      alert('Ticket created successfully!');
    } catch (err) {
      console.error('Error creating ticket:', err);
      alert(`Failed to create ticket: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({ 
      search: '', 
      status: '', 
      priority: '', 
      issueType: '',
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
            onClick={fetchTicketsAndStats}
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
            <LifeBuoy size={28} className="text-red-600" /> Support Tickets
        </h1>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <Plus size={20} /> New Ticket
        </button>
      </div>

      <TicketStats stats={stats} loading={loading} />

      <TicketFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onSearch={fetchTicketsAndStats} 
        onReset={handleResetFilters} 
      />

      {loading && tickets.length === 0 ? (
        <div className="flex justify-center h-60 items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <TicketTable 
          tickets={tickets}
          pagination={pagination}
          onPageChange={handlePageChange}
          onView={handleViewTicket}
        />
      )}

      {isCreateModalOpen && (
        <CreateTicketModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onConfirm={handleCreateTicket} 
          loading={loading}
        />
      )}
    </div>
  );
};

export default SupportTickets;