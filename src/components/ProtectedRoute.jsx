import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut, 
  User, 
  Store, 
  LayoutDashboard, 
  Settings, 
  Bell,
  Package,
  ChevronDown,
  ChevronRight,
  Users,       
  LifeBuoy,    
  FileText,
  ShoppingCart,
  DollarSign,
  BarChart3
} from 'lucide-react';

const ProtectedRoute = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(null); 
  const token = localStorage.getItem('superAdminToken');

  useEffect(() => {
    const storedUser = localStorage.getItem('superAdminUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('superAdminToken');
      localStorage.removeItem('superAdminUser');
      window.location.href = '/login';
    }
  };

  
// Menu Items with submenu
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    
    // VENDOR MANAGEMENT SUBMENU
    { icon: Store, label: 'Vendor Management', children: [
        { label: 'Vendor List', path: '/vendors' },
        { label: 'Vendor Details', path: '/vendor-details', comingSoon: true },
    ]},
    
    // CATEGORIES SUBMENU
    { icon: FileText, label: 'Categories', children: [
        { label: 'Category', path: '/categories' },
        { label: 'Subcategories', path: '/subcategories' },
    ]},
    
    // PRODUCTS (Separate)
    { icon: Package, label: 'Products', path: '/products' },
    
    // ORDER MANAGEMENT SUBMENU
    { icon: ShoppingCart, label: 'Order Management', children: [
        { label: 'All Orders', path: '/orders' },
        { label: 'Order Disputes', path: '/order-disputes' },
    ]},
    
    // CUSTOMER MANAGEMENT SUBMENU
    { icon: Users, label: 'Customer Management', children: [
        { label: 'All Customers', path: '/customers' },
        { label: 'Customer Support', path: '/support-tickets' },
        { label: 'Templates', path: '/templates' },
    ]},

    // // FINANCIAL MANAGEMENT (Coming Soon)
    // { icon: DollarSign, label: 'Financial Management', path: '/financial', comingSoon: true },
    // 7. FINANCIAL MANAGEMENT (Submenu - Detailed from the first list)
    { 
        icon: DollarSign, 
        label: 'Financial Management', 
        children: [
            { label: 'Revenue & Analytics', path: '/finance/revenue',comingSoon: true  },
            { label: 'Commission Settings', path: '/finance/commissions',comingSoon: true  },
            { label: 'Vendor Payouts', path: '/finance/payouts',comingSoon: true  },
            { label: 'Financial Reports', path: '/finance/reports',comingSoon: true  },
        ]
    },

    // 8. REPORTS & ANALYTICS (Submenu - Added the full list from the first concept)
    {
        icon: BarChart3,
        label: 'Reports & Analytics',
        children: [
            { label: 'Sales Reports', path: '/reports/sales',comingSoon: true  },
            { label: 'Vendor Analytics', path: '/reports/vendor',comingSoon: true  },
            { label: 'System Analytics', path: '/reports/system',comingSoon: true  },
            { label: 'Custom Reports', path: '/reports/custom',comingSoon: true  },
            { label: 'Audit Logs', path: '/reports/audit',comingSoon: true  },
        ]
    },
    
    // 9. NOTIFICATIONS (Direct Link) - Added back as a top-level item
    { 
        icon: Bell, 
        label: 'Notifications', 
        path: '/notifications', 
        comingSoon: true 
    },

    { icon: Settings, label: 'Settings', path: '/settings',comingSoon: true  },
  ];


  const handleToggle = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-red-600 transition-all duration-300 overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-red-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-red-600" size={24} />
              </div>
              <div className="text-white">
                <h1 className="font-bold text-lg">Super Admin</h1>
                <p className="text-red-200 text-xs">Control Panel</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = window.location.pathname === item.path;

                // 👇 If the item has a submenu
                if (item.children) {
                  const isOpen = openMenu === item.label;
                  return (
                    <li key={index}>
                      <button
                        onClick={() => handleToggle(item.label)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-white hover:bg-red-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={20} />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>

                      {/* Submenu */}
                      {isOpen && (
                        <ul className="ml-10 mt-1 space-y-1 transition-all">
                          {item.children.map((sub, i) => {
                            const isSubActive = window.location.pathname === sub.path;
                            return (
                              <li key={i}>
                                <a
                                  href={sub.path}
                                  className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                                    isSubActive
                                      ? 'bg-white text-red-600'
                                      : 'text-red-100 hover:bg-red-700'
                                  }`}
                                >
                                  {sub.label}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                }

                // 👇 Normal menu item
                return (
                  <li key={index}>
                    <a
                      href={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-white text-red-600'
                          : 'text-white hover:bg-red-700'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-red-700">
            <div className="bg-red-700 rounded-lg p-4 mb-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <User className="text-red-600" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{user?.name || 'Admin'}</p>
                  <p className="text-red-200 text-xs truncate">{user?.email || ''}</p>
                </div>
              </div>
              <span className="inline-block px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                Active
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-700 hover:bg-red-800 text-white rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.name?.charAt(0) || 'S'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{user?.name || 'Super Admin'}</p>
                  <p className="text-xs text-green-600">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;