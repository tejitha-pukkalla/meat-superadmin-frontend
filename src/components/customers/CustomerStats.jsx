// src/components/customers/CustomerStats.jsx
import { Users, UserCheck, UserX, UserMinus, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const CustomerStats = ({ stats, loading }) => {
  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers || 0,
      icon: Users,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      subtitle: `${stats.newCustomers || 0} new this month`,
      trend: (stats.newCustomers || 0) > 0 ? 'up' : 'stable',
    },
    {
      title: 'Active Customers',
      value: stats.activeCustomers || 0,
      icon: UserCheck,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
      subtitle: 'Currently active',
      percentage: stats.totalCustomers > 0 
        ? Math.round((stats.activeCustomers / stats.totalCustomers) * 100) 
        : 0,
    },
    {
      title: 'Blocked Customers',
      value: stats.blockedCustomers || 0,
      icon: UserX,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200',
      subtitle: 'Access restricted',
      percentage: stats.totalCustomers > 0 
        ? Math.round((stats.blockedCustomers / stats.totalCustomers) * 100) 
        : 0,
    },
    {
      title: 'Inactive Customers',
      value: stats.inactiveCustomers || 0,
      icon: UserMinus,
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600',
      borderColor: 'border-gray-200',
      subtitle: 'Not active',
      percentage: stats.totalCustomers > 0 
        ? Math.round((stats.inactiveCustomers / stats.totalCustomers) * 100) 
        : 0,
    },
    {
      title: 'Total Spending',
      value: `₹${(stats.totalSpending || 0).toLocaleString()}`,
      icon: DollarSign,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      subtitle: `Avg: ₹${(stats.averageSpending || 0).toLocaleString()}`,
      trend: 'up',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-lg h-40 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-sm border ${stat.borderColor} p-5 hover:shadow-md transition-shadow`}
          >
            {/* Icon and Trend */}
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className={stat.iconColor} size={24} />
              </div>
              {stat.trend && (
                <div className="flex items-center">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="text-green-500" size={20} />
                  ) : stat.trend === 'down' ? (
                    <TrendingDown className="text-red-500" size={20} />
                  ) : null}
                </div>
              )}
            </div>

            {/* Title */}
            <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>

            {/* Value */}
            <div className="flex items-baseline gap-2 mb-2">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              {stat.percentage !== undefined && (
                <span className={`text-sm font-semibold ${
                  stat.percentage > 50 ? 'text-green-600' : 
                  stat.percentage > 25 ? 'text-yellow-600' : 
                  'text-gray-600'
                }`}>
                  {stat.percentage}%
                </span>
              )}
            </div>

            {/* Subtitle */}
            <p className="text-gray-500 text-xs">{stat.subtitle}</p>

            {/* Progress Bar for percentages */}
            {stat.percentage !== undefined && (
              <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    stat.percentage > 50 ? 'bg-green-500' : 
                    stat.percentage > 25 ? 'bg-yellow-500' : 
                    'bg-gray-400'
                  }`}
                  style={{ width: `${stat.percentage}%` }}
                ></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CustomerStats;