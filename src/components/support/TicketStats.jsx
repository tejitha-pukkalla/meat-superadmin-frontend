// src/components/support/TicketStats.jsx
import { Ticket, Clock, CheckCircle, Hourglass, TrendingUp, TrendingDown } from 'lucide-react';

const TicketStats = ({ stats, loading }) => {
  const statCards = [
    {
      title: 'Total Tickets',
      value: stats.totalTickets || 0,
      icon: Ticket,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      subtitle: `${stats.highPriorityTickets || 0} High Priority`,
      trend: 'stable',
    },
    {
      title: 'Open Tickets',
      value: stats.openTickets || 0,
      icon: Hourglass,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      subtitle: `${stats.inProgressTickets || 0} In Progress`,
      percentage: stats.totalTickets > 0 ? Math.round((stats.openTickets / stats.totalTickets) * 100) : 0,
    },
    {
      title: 'Resolved Tickets',
      value: stats.resolvedTickets || 0,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      subtitle: 'Tickets closed successfully',
      percentage: stats.totalTickets > 0 ? Math.round((stats.resolvedTickets / stats.totalTickets) * 100) : 0,
    },
    {
      title: 'Avg. Resolution Time',
      value: `${stats.avgResolutionTimeHours || 0} hrs`,
      icon: Clock,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      subtitle: 'Time from creation to close',
      trend: 'down', // Assuming lower time is better
    },
  ];

  if (loading) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {statCards.map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-lg h-32"></div>
            ))}
        </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative"
        >
          {/* Icon and Trend */}
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-full ${stat.bgColor} ${stat.iconColor}`}>
              <stat.icon size={20} />
            </div>
            {stat.trend && (
              <div className="text-xs font-medium flex items-center gap-1">
                {stat.trend === 'up' ? <TrendingUp size={14} className="text-green-500" /> : stat.trend === 'down' ? <TrendingDown size={14} className="text-red-500" /> : null}
              </div>
            )}
          </div>

          {/* Title and Value */}
          <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            {stat.percentage !== undefined && (
              <span className={`text-sm font-semibold ${stat.percentage > 70 ? 'text-green-600' : 'text-gray-600'}`}>
                {stat.percentage}%
              </span>
            )}
          </div>

          {/* Subtitle/Description */}
          <p className="text-gray-500 text-xs">{stat.subtitle}</p>

          {/* Progress Bar for percentages */}
          {stat.percentage !== undefined && (
            <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${stat.percentage > 70 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${stat.percentage}%` }}
              ></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TicketStats;