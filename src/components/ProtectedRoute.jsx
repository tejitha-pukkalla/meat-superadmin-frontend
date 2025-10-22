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
  Package // NEW: Import Package icon
} from 'lucide-react';

const ProtectedRoute = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
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

  // Updated menu items with Categories and Subcategories
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Store, label: 'Vendors', path: '/vendors' },
    { icon: Package, label: 'Categories', path: '/categories' },        // NEW
    { icon: Package, label: 'Subcategories', path: '/subcategories' }, // NEW
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-red-600 transition-all duration-300 overflow-hidden`}>
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