import React from "react";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import './App.css'
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/services';
import Contact from './pages/Contact';
import Mission from './pages/Mission';
import FAQPage from './pages/FAQPage';



function App() {
  // Define the routes with RootLayout wrapping all pages
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/mission",
          element: <Mission />, // Blog route
        },
        {
          path: "/services",
          element: <Services />, // Services route
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        
        {
          path: "/faq",
          element: <FAQPage />,
        },
        
       
        
      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
