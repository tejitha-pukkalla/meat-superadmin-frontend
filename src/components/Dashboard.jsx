//this is orginal file 
import { useState, useEffect } from 'react';
import { vendorAPI } from '../api/api';
import { Store, ShoppingCart, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVendors: 0,
    activeVendors: 0,
    pendingApprovals: 0,
    totalOrders: 1247,
    totalRevenue: 387650
  });
  const [recentVendors, setRecentVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all vendors
      const allVendorsResponse = await vendorAPI.getAllVendors({ limit: 100 });
      const vendors = allVendorsResponse.data.data;
      
      // Calculate stats
      const activeCount = vendors.filter(v => v.status === 'active').length;
      const pendingCount = vendors.filter(v => v.status === 'pending').length;
      
      setStats({
        totalVendors: vendors.length,
        activeVendors: activeCount,
        pendingApprovals: pendingCount,
        totalOrders: 1247,
        totalRevenue: 387650
      });

      // Get recent vendors (last 4)
      setRecentVendors(vendors.slice(0, 4));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const createdAt = new Date(date);
    const diffInHours = Math.floor((now - createdAt) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, Super Admin! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your platform today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Vendors */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Store className="text-blue-600" size={24} />
            </div>
            <span className="text-green-600 text-sm font-semibold">+12%</span>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Total Vendors</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalVendors}</p>
            <p className="text-gray-500 text-xs mt-2">{stats.activeVendors} active vendors</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-green-600" size={24} />
            </div>
            <span className="text-green-600 text-sm font-semibold">+8%</span>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            <p className="text-gray-500 text-xs mt-2">Last 30 days</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <span className="text-green-600 text-sm font-semibold">+15%</span>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-2">All time revenue</p>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-yellow-600" size={24} />
            </div>
            <span className="text-yellow-600 text-sm font-semibold">{stats.pendingApprovals}</span>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Pending Approvals</p>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingApprovals}</p>
            <p className="text-gray-500 text-xs mt-2">Vendors awaiting review</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Commission */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Platform Commission</h2>
          
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Commission per Order</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹20</p>
              </div>
              <DollarSign className="text-blue-600" size={32} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Delivery Partner</p>
                <p className="text-xl font-bold text-gray-900">₹10</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Platform Profit</p>
                <p className="text-xl font-bold text-gray-900">₹10</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Vendors */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Vendors</h2>
          
          <div className="space-y-4">
            {recentVendors.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No vendors yet</p>
            ) : (
              recentVendors.map((vendor) => (
                <div key={vendor._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Store className="text-red-600" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{vendor.name}</p>
                      <p className="text-xs text-gray-500">{formatTime(vendor.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(vendor.status)}`}>
                    {vendor.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
// this is original file 


// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   LayoutDashboard,
//   Store,
//   ShoppingCart,
//   DollarSign,
//   Users,
//   Settings,
//   LogOut,
//   Menu,
//   X,
//   ChevronDown,
//   ChevronRight,
//   AlertTriangle,
//   TrendingUp,
//   FileText,
//   Bell,
//   BarChart3,
//   Activity,
//   CheckCircle,
//   Clock,
//   Package,
//   UserCircle,
// } from 'lucide-react';

// const SuperAdminDashboard = ({ setIsAuthenticated }) => {
//   const navigate = useNavigate();
//   const [adminInfo, setAdminInfo] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [activeMenu, setActiveMenu] = useState('dashboard');
//   const [expandedMenus, setExpandedMenus] = useState({});

//   const [stats, setStats] = useState({
//     totalVendors: 48,
//     activeVendors: 42,
//     pendingVendors: 6,
//     totalOrders: 1247,
//     totalRevenue: 387650,
//     platformProfit: 125400,
//     totalCategories: 12,
//     totalSubcategories: 45,
//     totalCustomers: 892,
//     systemHealth: 98.5
//   });

//   const [recentVendors, setRecentVendors] = useState([
//     { id: 1, name: 'Fresh Meat Store', status: 'active', createdAt: '2 hours ago' },
//     { id: 2, name: 'Quality Butchers', status: 'active', createdAt: '5 hours ago' },
//     { id: 3, name: 'Prime Meats', status: 'active', createdAt: '1 day ago' },
//     { id: 4, name: 'City Meat Shop', status: 'pending', createdAt: '2 days ago' }
//   ]);

//   useEffect(() => {
//     const storedAdminInfo = localStorage.getItem('superAdminUser');
//     if (storedAdminInfo) {
//       setAdminInfo(JSON.parse(storedAdminInfo));
//     }

//     const handleResize = () => {
//       if (window.innerWidth >= 1024) {
//         setMobileMenuOpen(false);
//       }
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('superAdminToken');
//     localStorage.removeItem('superAdminUser');
//     localStorage.removeItem('userRole');
//     setIsAuthenticated(false);
//     navigate('/');
//   };

//   const toggleSubmenu = (menuKey) => {
//     setExpandedMenus(prev => ({
//       ...prev,
//       [menuKey]: !prev[menuKey]
//     }));
//   };

//   const menuItems = [
//     {
//       key: 'dashboard',
//       label: 'Dashboard',
//       icon: LayoutDashboard,
//       action: () => {
//         setActiveMenu('dashboard');
//         navigate('/superadmin/dashboard');
//       }
//     },
//     {
//       key: 'vendors',
//       label: 'Vendor Management',
//       icon: Store,
//       submenu: [
//         {
//           key: 'all-vendors',
//           label: 'All Vendors',
//           icon: Users,
//           action: () => alert('👥 Vendor Management - Coming Soon\n\n✅ View all vendors\n✅ Approve/Reject vendors\n✅ Vendor details and analytics')
//         },
//         {
//           key: 'pending-vendors',
//           label: 'Pending Approvals',
//           icon: Clock,
//           action: () => alert('⏳ Pending Approvals - Coming Soon\n\n✅ Review new vendors (6)\n✅ Approve/Reject applications\n✅ Request documents')
//         },
//         {
//           key: 'vendor-details',
//           label: 'Vendor Details',
//           icon: FileText,
//           action: () => alert('📋 Vendor Details - Coming Soon\n\n✅ View vendor profiles\n✅ Edit vendor info\n✅ View vendor performance')
//         }
//       ]
//     },
//     {
//       key: 'categories',
//       label: 'Categories',
//       icon: Package,
//       submenu: [
//         {
//           key: 'all-categories',
//           label: 'All Categories',
//           icon: Package,
//           action: () => alert('📦 Category Management - Coming Soon\n\n✅ View all categories (12)\n✅ Add/Edit/Delete categories\n✅ Manage category images')
//         },
//         {
//           key: 'subcategories',
//           label: 'Subcategories',
//           icon: Package,
//           action: () => alert('📦 Subcategory Management - Coming Soon\n\n✅ View all subcategories (45)\n✅ Add/Edit/Delete subcategories\n✅ Assign to categories')
//         }
//       ]
//     },
//     {
//       key: 'products',
//       label: 'Product Oversight',
//       icon: ShoppingCart,
//       submenu: [
//         {
//           key: 'all-products',
//           label: 'All Products',
//           icon: ShoppingCart,
//           action: () => alert('🛍️ Product Oversight - Coming Soon\n\n✅ View all vendor products\n✅ Filter by category/vendor\n✅ Monitor product quality')
//         },
//         // {
//         //   key: 'product-approvals',
//         //   label: 'Product Approvals',
//         //   icon: CheckCircle,
//         //   action: () => alert('✅ Product Approvals - Coming Soon\n\n✅ Review new products\n✅ Approve/Reject listings\n✅ Quality checks')
//         // }
//       ]
//     },
//     {
//       key: 'orders',
//       label: 'Order Management',
//       icon: ShoppingCart,
//       submenu: [
//         {
//           key: 'all-orders',
//           label: 'All Orders',
//           icon: ShoppingCart,
//           action: () => alert('📋 Order Management - Coming Soon\n\n✅ View all orders (1247)\n✅ Monitor order status\n✅ Handle disputes')
//         },
//         {
//           key: 'order-disputes',
//           label: 'Order Disputes',
//           icon: AlertTriangle,
//           action: () => alert('⚠️ Order Disputes - Coming Soon\n\n✅ Review complaints\n✅ Mediate disputes\n✅ Issue refunds')
//         }
//       ]
//     },
//     {
//       key: 'customers',
//       label: 'Customer Management',
//       icon: Users,
//       submenu: [
//         {
//           key: 'all-customers',
//           label: 'All Customers',
//           icon: Users,
//           action: () => alert('👥 Customer Management - Coming Soon\n\n✅ View all customers (892)\n✅ Customer details\n✅ Purchase history')
//         },
//         {
//           key: 'customer-support',
//           label: 'Customer Support',
//           icon: Bell,
//           action: () => alert('💬 Customer Support - Coming Soon\n\n✅ View support tickets\n✅ Respond to issues\n✅ Track resolution status')
//         }
//       ]
//     },
//     {
//       key: 'finance',
//       label: 'Financial Management',
//       icon: DollarSign,
//       submenu: [
//         {
//           key: 'revenue',
//           label: 'Revenue & Analytics',
//           icon: TrendingUp,
//           action: () => alert('💰 Revenue Analytics - Coming Soon\n\n✅ Total revenue: ₹387,650\n✅ Platform profit: ₹125,400\n✅ Revenue breakdown')
//         },
//         {
//           key: 'commissions',
//           label: 'Commission Settings',
//           icon: DollarSign,
//           action: () => alert('⚙️ Commission Settings - Coming Soon\n\n✅ Set vendor commission rates\n✅ Platform fees configuration\n✅ Payout schedules')
//         },
//         {
//           key: 'payouts',
//           label: 'Vendor Payouts',
//           icon: DollarSign,
//           action: () => alert('💳 Vendor Payouts - Coming Soon\n\n✅ Process payouts\n✅ Payout history\n✅ Payment methods')
//         },
//         {
//           key: 'financial-reports',
//           label: 'Financial Reports',
//           icon: FileText,
//           action: () => alert('📊 Financial Reports - Coming Soon\n\n✅ Generate reports\n✅ Export data\n✅ Tax calculations')
//         }
//       ]
//     },
//     {
//       key: 'reports',
//       label: 'Reports & Analytics',
//       icon: BarChart3,
//       submenu: [
//         {
//           key: 'sales-reports',
//           label: 'Sales Reports',
//           icon: BarChart3,
//           action: () => alert('📊 Sales Reports - Coming Soon\n\n✅ Daily/Weekly/Monthly sales\n✅ Top products\n✅ Sales trends')
//         },
//         {
//           key: 'vendor-analytics',
//           label: 'Vendor Analytics',
//           icon: TrendingUp,
//           action: () => alert('📈 Vendor Analytics - Coming Soon\n\n✅ Vendor performance\n✅ Rating trends\n✅ Growth metrics')
//         },
//         {
//           key: 'system-analytics',
//           label: 'System Analytics',
//           icon: Activity,
//           action: () => alert('🔍 System Analytics - Coming Soon\n\n✅ System health (98.5%)\n✅ Performance metrics\n✅ Error tracking')
//         },
//         {
//           key: 'custom-reports',
//           label: 'Custom Reports',
//           icon: FileText,
//           action: () => alert('📋 Custom Reports - Coming Soon\n\n✅ Create custom reports\n✅ Schedule reports\n✅ Export formats')
//         },
//         {
//           key: 'audit-logs',
//           label: 'Audit Logs',
//           icon: FileText,
//           action: () => alert('📝 Audit Logs - Coming Soon\n\n✅ Admin actions\n✅ User activities\n✅ System events')
//         }
//       ]
//     },
//     {
//       key: 'notifications',
//       label: 'Notifications',
//       icon: Bell,
//       action: () => {
//         setActiveMenu('notifications');
//         alert('🔔 Notifications - Coming Soon\n\n✅ System alerts\n✅ Vendor notifications\n✅ Customer support alerts\n✅ Financial alerts');
//       }
//     },
//     {
//       key: 'settings',
//       label: 'Settings',
//       icon: Settings,
//       action: () => {
//         setActiveMenu('settings');
//         alert('⚙️ Settings - Coming Soon\n\n✅ Platform settings\n✅ Commission rates\n✅ Email templates\n✅ System configuration');
//       }
//     }
//   ];

//   const statCards = [
//     {
//       title: 'Total Vendors',
//       value: stats.totalVendors,
//       subtitle: `${stats.activeVendors} active, ${stats.pendingVendors} pending`,
//       icon: Store,
//       bgColor: 'bg-blue-50',
//       textColor: 'text-blue-600',
//       status: '⏳ Coming Soon'
//     },
//     {
//       title: 'Total Orders',
//       value: stats.totalOrders,
//       subtitle: 'Last 30 days',
//       icon: ShoppingCart,
//       bgColor: 'bg-green-50',
//       textColor: 'text-green-600',
//       status: '⏳ Coming Soon'
//     },
//     {
//       title: 'Total Revenue',
//       value: `₹${stats.totalRevenue.toLocaleString()}`,
//       subtitle: 'All time revenue',
//       icon: DollarSign,
//       bgColor: 'bg-purple-50',
//       textColor: 'text-purple-600',
//       status: '⏳ Coming Soon'
//     },
//     {
//       title: 'Platform Profit',
//       value: `₹${stats.platformProfit.toLocaleString()}`,
//       subtitle: 'After vendor commissions',
//       icon: TrendingUp,
//       bgColor: 'bg-orange-50',
//       textColor: 'text-orange-600',
//       status: '⏳ Coming Soon'
//     }
//   ];

//   const quickActions = [
//     {
//       title: 'Approve Vendors',
//       icon: CheckCircle,
//       color: 'bg-green-600 hover:bg-green-700',
//       action: () => alert('✅ Vendor Approvals - Coming Soon'),
//       badge: stats.pendingVendors,
//       status: '⏳'
//     },
//     {
//       title: 'View Orders',
//       icon: ShoppingCart,
//       color: 'bg-blue-600 hover:bg-blue-700',
//       action: () => alert('📋 Order Management - Coming Soon'),
//       status: '⏳'
//     },
//     {
//       title: 'Revenue Report',
//       icon: TrendingUp,
//       color: 'bg-purple-600 hover:bg-purple-700',
//       action: () => alert('💰 Revenue Report - Coming Soon'),
//       status: '⏳'
//     },
//     {
//       title: 'System Health',
//       icon: Activity,
//       color: 'bg-red-600 hover:bg-red-700',
//       action: () => alert('🏥 System Health - Coming Soon\n\nSystem Health: 98.5%\nAll systems operational'),
//       status: '⏳'
//     }
//   ];

//   const recentActivities = [
//     {
//       icon: Store,
//       iconBg: 'bg-blue-100',
//       iconColor: 'text-blue-600',
//       title: 'New vendor registered',
//       subtitle: 'Fresh Meat Store - Pending approval',
//       time: '2 hours ago',
//       status: '⏳ Vendor Management - Coming Soon'
//     },
//     {
//       icon: ShoppingCart,
//       iconBg: 'bg-green-100',
//       iconColor: 'text-green-600',
//       title: 'New order placed',
//       subtitle: 'Order #12345 - ₹2,450',
//       time: '15 min ago',
//       status: '⏳ Order Management - Coming Soon'
//     },
//     {
//       icon: AlertTriangle,
//       iconBg: 'bg-red-100',
//       iconColor: 'text-red-600',
//       title: 'Order dispute reported',
//       subtitle: 'Order #12340 - Quality complaint',
//       time: '1 hour ago',
//       status: '⏳ Dispute Management - Coming Soon'
//     },
//     {
//       icon: DollarSign,
//       iconBg: 'bg-purple-100',
//       iconColor: 'text-purple-600',
//       title: 'Payout processed',
//       subtitle: 'Vendor: Quality Butchers - ₹5,200',
//       time: '3 hours ago',
//       status: '⏳ Financial Management - Coming Soon'
//     },
//     {
//       icon: Users,
//       iconBg: 'bg-orange-100',
//       iconColor: 'text-orange-600',
//       title: 'New customer registered',
//       subtitle: 'Total customers: 892',
//       time: '5 hours ago',
//       status: '⏳ Customer Management - Coming Soon'
//     }
//   ];

//   const MenuItem = ({ item, isSubmenuItem = false }) => {
//     const isActive = activeMenu === item.key;
//     const isExpanded = expandedMenus[item.key];
//     const hasSubmenu = item.submenu && item.submenu.length > 0;

//     const handleClick = () => {
//       if (hasSubmenu) {
//         toggleSubmenu(item.key);
//       } else {
//         setActiveMenu(item.key);
//         if (item.action) item.action();
//         if (window.innerWidth < 1024) {
//           setMobileMenuOpen(false);
//         }
//       }
//     };

//     return (
//       <div className={isSubmenuItem ? 'ml-4' : ''}>
//         <button
//           onClick={handleClick}
//           className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
//             isActive
//               ? 'bg-red-600 text-white shadow-md'
//               : 'text-gray-700 hover:bg-gray-100'
//           } ${!sidebarOpen && !isSubmenuItem ? 'justify-center' : ''}`}
//         >
//           <div className="flex items-center gap-3">
//             <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
//             {(sidebarOpen || isSubmenuItem) && (
//               <span className="font-medium text-sm">{item.label}</span>
//             )}
//           </div>
//           {hasSubmenu && sidebarOpen && (
//             isExpanded ?
//               <ChevronDown className="w-4 h-4" /> :
//               <ChevronRight className="w-4 h-4" />
//           )}
//         </button>

//         {hasSubmenu && sidebarOpen && (
//           <div
//             className={`overflow-hidden transition-all duration-300 ease-in-out ${
//               isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
//             }`}
//           >
//             <div className="pl-4 space-y-1">
//               {item.submenu.map((subItem) => (
//                 <MenuItem key={subItem.key} item={subItem} isSubmenuItem />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Desktop Sidebar */}
//       <aside
//         className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
//           sidebarOpen ? 'w-64' : 'w-20'
//         }`}
//       >
//         <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
//           {sidebarOpen && (
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-sm">SA</span>
//               </div>
//               <span className="font-bold text-gray-800">Super Admin</span>
//             </div>
//           )}
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//           >
//             <Menu className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         <nav className="flex-1 p-4 overflow-y-auto">
//           <div className="space-y-2">
//             {menuItems.map((item) => (
//               <MenuItem key={item.key} item={item} />
//             ))}
//           </div>
//         </nav>

//         <div className="p-4 border-t border-gray-200">
//           <button
//             onClick={handleLogout}
//             className={`w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 ${
//               !sidebarOpen ? 'justify-center' : ''
//             }`}
//           >
//             <LogOut className="w-5 h-5" />
//             {sidebarOpen && <span className="font-medium">Logout</span>}
//           </button>
//         </div>
//       </aside>

//       {/* Mobile Sidebar Overlay */}
//       {mobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={() => setMobileMenuOpen(false)}
//         />
//       )}

//       {/* Mobile Sidebar */}
//       <aside
//         className={`lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
//           mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//       >
//         <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-sm">SA</span>
//             </div>
//             <span className="font-bold text-gray-800">Super Admin</span>
//           </div>
//           <button
//             onClick={() => setMobileMenuOpen(false)}
//             className="p-2 rounded-lg hover:bg-gray-100"
//           >
//             <X className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         <nav className="flex-1 p-4 overflow-y-auto">
//           <div className="space-y-2">
//             {menuItems.map((item) => (
//               <MenuItem key={item.key} item={item} />
//             ))}
//           </div>
//         </nav>

//         <div className="p-4 border-t border-gray-200">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
//           >
//             <LogOut className="w-5 h-5" />
//             <span className="font-medium">Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Top Navbar */}
//         <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
//           <button
//             onClick={() => setMobileMenuOpen(true)}
//             className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
//           >
//             <Menu className="w-6 h-6 text-gray-600" />
//           </button>

//           <h1 className="text-xl font-bold text-gray-800 hidden lg:block">
//             Super Admin Dashboard
//           </h1>

//           <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
//             <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
//               <span className="text-sm font-semibold text-white">
//                 {adminInfo?.name?.charAt(0).toUpperCase() || 'A'}
//               </span>
//             </div>
//             <div className="hidden sm:block">
//               <p className="text-sm font-semibold text-gray-800">
//                 {adminInfo?.name || 'Admin'}
//               </p>
//               <p className="text-xs text-green-600">Online</p>
//             </div>
//           </div>
//         </header>

//         {/* Main Content */}
//         <main className="flex-1 overflow-auto p-4 lg:p-8">
//           {/* Welcome Section */}
//           <div className="mb-8">
//             <h2 className="text-3xl font-bold text-gray-800">
//               Welcome back, {adminInfo?.name || 'Super Admin'}!
//             </h2>
//             <p className="text-gray-600 mt-2">
//               Here's what's happening with your platform today
//             </p>

//             {/* Implementation Status Banner */}
//             <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <div className="flex items-start gap-3">
//                 <div className="text-2xl">ℹ️</div>
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-blue-900 mb-1">Dashboard Reference (Static Data)</h3>
//                   <p className="text-sm text-blue-700 mb-2">
//                     This dashboard shows what features are available and coming soon:
//                   </p>
//                   <div className="text-xs text-blue-600 space-y-1">
//                     <div>✅ <strong>Implemented:</strong> Authentication, Static Dashboard View, Vendor Management, Categories , subcategories</div>
//                     <div>⏳ <strong>Coming Soon:</strong>   Orders, Financial, Reports, Notifications, Settings (12 modules)</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {statCards.map((stat, index) => (
//               <div
//                 key={index}
//                 className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition duration-200"
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <div className={`${stat.bgColor} p-3 rounded-lg`}>
//                     <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
//                   </div>
//                   <span className="text-xs font-medium text-gray-500">{stat.status}</span>
//                 </div>
//                 <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
//                 <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
//                 <p className="text-xs text-gray-500">{stat.subtitle}</p>
//               </div>
//             ))}
//           </div>

//           {/* Quick Actions */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">
//               Quick Actions
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               {quickActions.map((action, index) => (
//                 <button
//                   key={index}
//                   onClick={action.action}
//                   className={`${action.color} text-white p-4 rounded-lg flex items-center justify-center gap-3 transition duration-200 shadow-sm hover:shadow-md relative`}
//                 >
//                   <action.icon className="w-5 h-5" />
//                   <span className="font-semibold">{action.title}</span>
//                   {action.badge && (
//                     <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
//                       {action.badge}
//                     </span>
//                   )}
//                   <span className="absolute bottom-1 right-1 text-xs opacity-75">{action.status}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Platform Commission Info */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <h3 className="text-lg font-bold text-gray-800 mb-4">Platform Commission</h3>

//               <div className="space-y-4">
//                 <div className="bg-blue-50 rounded-lg p-4">
//                   <p className="text-sm text-gray-600">Commission per Order</p>
//                   <p className="text-2xl font-bold text-gray-800 mt-1">₹20</p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-green-50 rounded-lg p-4">
//                     <p className="text-xs text-gray-600 mb-1">Delivery Partner Cut</p>
//                     <p className="text-xl font-bold text-gray-800">₹10</p>
//                   </div>
//                   <div className="bg-purple-50 rounded-lg p-4">
//                     <p className="text-xs text-gray-600 mb-1">Platform Profit</p>
//                     <p className="text-xl font-bold text-gray-800">₹10</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Recent Vendors */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Vendors</h3>

//               <div className="space-y-3">
//                 {recentVendors.map((vendor) => (
//                   <div key={vendor.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
//                         <Store className="text-red-600" size={20} />
//                       </div>
//                       <div>
//                         <p className="font-semibold text-gray-900">{vendor.name}</p>
//                         <p className="text-xs text-gray-500">{vendor.createdAt}</p>
//                       </div>
//                     </div>
//                     <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
//                       vendor.status === 'active'
//                         ? 'bg-green-100 text-green-700'
//                         : 'bg-yellow-100 text-yellow-700'
//                     }`}>
//                       {vendor.status}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Recent Activity */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">
//               Recent Activity (Static Reference)
//             </h3>
//             <div className="space-y-3">
//               {recentActivities.map((activity, index) => (
//                 <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
//                   <div className={`w-10 h-10 ${activity.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
//                     <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-semibold text-gray-800">
//                       {activity.title}
//                     </p>
//                     <p className="text-xs text-gray-500">{activity.subtitle}</p>
//                     <p className="text-xs text-blue-600 mt-1">{activity.status}</p>
//                   </div>
//                   <span className="text-xs text-gray-500 flex-shrink-0">{activity.time}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Module Status Overview */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">
//               Module Implementation Status
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
//                 <div className="flex items-center gap-2 mb-2">
//                   <CheckCircle className="w-5 h-5 text-green-600" />
//                   <h4 className="font-semibold text-green-900">✅ Completed (2)</h4>
//                 </div>
//                 <ul className="text-sm text-green-700 space-y-1">
//                   <li>• Authentication</li>
//                   <li>• Dashboard (Static)</li>
//                 </ul>
//               </div>

//               <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Clock className="w-5 h-5 text-orange-600" />
//                   <h4 className="font-semibold text-orange-900">⏳ High Priority (3)</h4>
//                 </div>
//                 <ul className="text-sm text-orange-700 space-y-1">
//                   <li>• Vendor Management</li>
//                   <li>• Category Management</li>
//                   <li>• Order Management</li>
//                 </ul>
//               </div>

//               <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                 <div className="flex items-center gap-2 mb-2">
//                   <TrendingUp className="w-5 h-5 text-blue-600" />
//                   <h4 className="font-semibold text-blue-900">⏳ Medium Priority (4)</h4>
//                 </div>
//                 <ul className="text-sm text-blue-700 space-y-1">
//                   <li>• Product Oversight</li>
//                   <li>• Customer Management</li>
//                   <li>• Financial Management</li>
//                   <li>• Notifications</li>
//                 </ul>
//               </div>

//               <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
//                 <div className="flex items-center gap-2 mb-2">
//                   <BarChart3 className="w-5 h-5 text-purple-600" />
//                   <h4 className="font-semibold text-purple-900">⏳ Medium Priority (1)</h4>
//                 </div>
//                 <ul className="text-sm text-purple-700 space-y-1">
//                   <li>• Reports & Analytics</li>
//                 </ul>
//               </div>

//               <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Bell className="w-5 h-5 text-gray-600" />
//                   <h4 className="font-semibold text-gray-900">⏸️ Low Priority (2)</h4>
//                 </div>
//                 <ul className="text-sm text-gray-700 space-y-1">
//                   <li>• Settings</li>
//                   <li>• Support & Help</li>
//                 </ul>
//               </div>

//               <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
//                 <div className="flex items-center gap-2 mb-2">
//                   <FileText className="w-5 h-5 text-indigo-600" />
//                   <h4 className="font-semibold text-indigo-900">📋 Total Modules (14)</h4>
//                 </div>
//                 <div className="text-sm text-indigo-700">
//                   <div className="flex justify-between mb-1">
//                     <span>Progress</span>
//                     <span className="font-semibold">14%</span>
//                   </div>
//                   <div className="w-full bg-indigo-200 rounded-full h-2">
//                     <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '14%' }}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Feature Roadmap */}
//           <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-200 p-6 mt-8">
//             <div className="flex items-start gap-4">
//               <div className="text-3xl">🚀</div>
//               <div className="flex-1">
//                 <h3 className="text-lg font-bold text-gray-900 mb-2">Upcoming Features</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   <div className="bg-white rounded-lg p-3">
//                     <h4 className="font-semibold text-gray-800 text-sm mb-1">Vendor Management</h4>
//                     <p className="text-xs text-gray-600">Approve vendors, manage details, view analytics</p>
//                   </div>
//                   <div className="bg-white rounded-lg p-3">
//                     <h4 className="font-semibold text-gray-800 text-sm mb-1">Order Management</h4>
//                     <p className="text-xs text-gray-600">Monitor orders, handle disputes, track deliveries</p>
//                   </div>
//                   <div className="bg-white rounded-lg p-3">
//                     <h4 className="font-semibold text-gray-800 text-sm mb-1">Financial Dashboard</h4>
//                     <p className="text-xs text-gray-600">Revenue tracking, payouts, commission settings</p>
//                   </div>
//                   <div className="bg-white rounded-lg p-3">
//                     <h4 className="font-semibold text-gray-800 text-sm mb-1">Category Management</h4>
//                     <p className="text-xs text-gray-600">Create categories, subcategories, manage inventory</p>
//                   </div>
//                   <div className="bg-white rounded-lg p-3">
//                     <h4 className="font-semibold text-gray-800 text-sm mb-1">Reports & Analytics</h4>
//                     <p className="text-xs text-gray-600">Sales trends, vendor performance, system health</p>
//                   </div>
//                   <div className="bg-white rounded-lg p-3">
//                     <h4 className="font-semibold text-gray-800 text-sm mb-1">Customer Support</h4>
//                     <p className="text-xs text-gray-600">Manage support tickets, customer issues, disputes</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default SuperAdminDashboard;

// static dashboard 