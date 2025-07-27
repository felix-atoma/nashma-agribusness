import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import './App.css';

import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/services';
import Contact from './pages/Contact';
import Mission from './pages/Mission';
import FAQPage from './pages/FAQPage';
import Products from "./pages/ProductPage";
import Cart from "./pages/Cart"; // Import the Cart component

import { CartProvider } from './context/CartContext';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/about", element: <About /> },
        { path: "/mission", element: <Mission /> },
        { path: "/services", element: <Services /> },
        { path: "/contact", element: <Contact /> },
        { path: "/faq", element: <FAQPage /> },
        { path: "/products", element: <Products /> },
        { path: "/cart", element: <Cart /> }, // Add cart route
      ],
    },
  ]);

  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}

export default App;