import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/Dashboard';
import CreateProduct from './pages/CreateProduct';
import ManageProducts from './pages/ManageProducts';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage'; // ✅ Import the new page

// Route Protection
import ProtectedRoute from './pages/ProtectedRoute';
import AdminRoute from './pages/AdminRoute';

// Loading component
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <React.Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Root Layout for all routes */}
                <Route element={<RootLayout />}>
                  {/* Public Routes */}
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="mission" element={<Mission />} />
                  <Route path="services" element={<Services />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="faq" element={<FAQPage />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/:id" element={<ProductDetail />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="reset-password/:token" element={<ResetPassword />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success" element={<OrderSuccessPage />} /> {/* ✅ Add Order Success route */}

                  {/* Protected User Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="profile" element={<Profile />} />
                    <Route path="orders" element={<Orders />} />
                  </Route>
                </Route>

                {/* Admin Routes with separate layout */}
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
                  <Route path="products/edit/:id" element={<CreateProduct />} />
                  <Route path="products" element={<ManageProducts />} />
                </Route>

                {/* Error Handling */}
                <Route path="not-found" element={<NotFound />} />
                <Route path="*" element={<Navigate to="not-found" replace />} />
              </Routes>
            </React.Suspense>

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
              theme="colored"
            />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;