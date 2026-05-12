// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import RootLayout from './layouts/RootLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';

// SEO + Analytics
import GlobalSEO from './components/GlobalSEO';
import AnalyticsTracker from './components/AnalyticsTracker';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/services';
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
import Settings from './pages/Settings';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import CocoaPotashPage from './pages/CocoaPotashPage';
import AfricanBlackSoapPage from './pages/AfricanBlackSoapPage';
import WomenYouthTrainingPage from './pages/WomenYouthTrainingPage';
import GlobalBulkSupplyPage from './pages/GlobalBulkSupplyPage';
import FarmingWorkshopsPage from './pages/FarmingWorkshopsPage';
import ProtectedRoute from './pages/ProtectedRoute';
import AdminRoute from './pages/AdminRoute';
import AdminOrders from './pages/AdminOrders';
import LoadingSpinner from './components/LoadingSpinner';
import AuthDrawer from './components/AuthDrawer';
import CartDrawer from './components/CartDrawer';
import CheckoutDrawer from './components/CheckoutDrawer';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const googleOAuthEnabled =
  !!GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.startsWith('your_');

function App() {
  const inner = (
    <HelmetProvider>
      <BrowserRouter>
        <GlobalSEO />
        <AnalyticsTracker />

        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <React.Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route element={<RootLayout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="mission" element={<Mission />} />
                    <Route path="services" element={<Services />} />
                    <Route path="services/cocoa-potash" element={<CocoaPotashPage />} />
                    <Route path="services/african-black-soap" element={<AfricanBlackSoapPage />} />
                    <Route path="services/women-youth-training" element={<WomenYouthTrainingPage />} />
                    <Route path="services/global-bulk-supply" element={<GlobalBulkSupplyPage />} />
                    <Route path="services/farming-workshops" element={<FarmingWorkshopsPage />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="faq" element={<FAQPage />} />
                    <Route path="products" element={<Products />} />
                    <Route path="products/:id" element={<ProductDetail />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-success" element={<OrderSuccessPage />} />

                    <Route element={<ProtectedRoute />}>
                      <Route path="profile" element={<Profile />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="orders" element={<Orders />} />
                    </Route>
                  </Route>

                  <Route element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password/:token" element={<ResetPassword />} />
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
                    <Route path="products/edit/:id" element={<CreateProduct />} />
                    <Route path="products" element={<ManageProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                  </Route>

                  <Route path="not-found" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="not-found" replace />} />
                </Routes>
              </React.Suspense>

              <AuthDrawer />
              <CartDrawer />
              <CheckoutDrawer />

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
    </HelmetProvider>
  );

  return googleOAuthEnabled ? (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {inner}
    </GoogleOAuthProvider>
  ) : inner;
}

export default App;
