import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import RootLayout from './layouts/RootLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Mission from './pages/Mission';
import FAQPage from './pages/FAQPage';
import Products from './pages/ProductPage';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/Dashboard';
import CreateProduct from './pages/CreateProduct';
import ManageProducts from './pages/ManageProducts';

// Protected Routes
import ProtectedRoute from './pages/ProtectedRoute';
import AdminRoute from './pages/AdminRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="mission" element={<Mission />} />
              <Route path="services" element={<Services />} />
              <Route path="contact" element={<Contact />} />
              <Route path="faq" element={<FAQPage />} />
              <Route path="products" element={<Products />} />
              <Route 
                path="cart" 
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } 
              />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Route>
            
            <Route 
              path="admin" 
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products/create" element={<CreateProduct />} />
              <Route path="products" element={<ManageProducts />} />
            </Route>
          </Routes>
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;