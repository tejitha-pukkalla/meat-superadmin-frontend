import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Vendors from './components/Vendors';
import CategoryList from './components/categories/CategoryList';
import SubcategoryList from './components/categories/SubcategoryList';
import ProductManagement from './pages/ProductManagement';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('superAdminToken')
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={<Login setIsAuthenticated={setIsAuthenticated} />} 
        />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vendors" element={<Vendors />} />
          
          {/* Category Management Routes */}
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/subcategories" element={<SubcategoryList />} />
          

             {/* Product Management Route - NEW */}
          <Route path="/products" element={<ProductManagement />} />


          {/* Settings Route */}
          <Route path="/settings" element={
            <div className="p-6">
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-gray-600 mt-2">Settings page coming soon...</p>
            </div>
          } />
        </Route>

        {/* Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;