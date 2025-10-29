// src/components/support/TicketTable.jsx
import { useMemo } from 'react';
import { Tag, Clock, User, ArrowUpRight } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import Pagination from '../common/Pagination';

const TicketTable = ({ tickets, onView, pagination, onPageChange, onSort }) => {
  const formatDate = (date) => new Date(date).toLocaleString();

  if (!tickets || tickets.length === 0) {
    return <div className="p-6 text-center text-gray-500">No support tickets found.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['ID', 'Subject', 'Customer', 'Type', 'Priority', 'Status', 'Assigned To', 'Created', 'Actions'].map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors"
                  // onClick={() => onSort(header.toLowerCase())}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  #{ticket.ticketId}
                </td>
                <td className="px-6 py-4 max-w-sm truncate text-sm text-gray-900">
                  {ticket.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ticket.customerName || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-1"><Tag size={14} />{ticket.issueType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ticket.assignedToName || 'Unassigned'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(ticket.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onView(ticket)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    View <ArrowUpRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="p-4">
          <Pagination 
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default TicketTable;