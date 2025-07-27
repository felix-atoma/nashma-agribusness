import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [loading, setLoading] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const menuItems = ["Home", "About", "Services", "Products", "Contact"];

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center h-screen bg-white z-[100] fixed inset-0">
          <img src="/nashma-removebg-preview.png" alt="Logo" className="h-20 w-20" />
        </div>
      )}

      <nav className="bg-white text-green-600 p-4 fixed top-0 left-0 w-full shadow-md z-[1000]">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <img src="/nashma-removebg-preview.png" alt="Logo" className="h-10" />

          {/* Hamburger */}
          <div className="md:hidden">
            {menuOpen ? (
              <FaTimes className="text-green-600 text-2xl cursor-pointer" onClick={() => setMenuOpen(false)} />
            ) : (
              <FaBars className="text-green-600 text-2xl cursor-pointer" onClick={() => setMenuOpen(true)} />
            )}
          </div>

          {/* Desktop Links */}
          <ul className="hidden md:flex space-x-6 items-center">
            {menuItems.map((text, index) => (
              <li key={index} className="relative">
                <Link
                  to={text === "Home" ? "/" : `/${text.toLowerCase()}`}
                  className="text-green-600 hover:text-green-800 font-bold text-base relative"
                  onClick={() => handleNavigation(text === "Home" ? "/" : `/${text.toLowerCase()}`)}
                  onMouseEnter={(e) => (e.currentTarget.querySelector(".hover-bar").style.width = "100%")}
                  onMouseLeave={(e) => (e.currentTarget.querySelector(".hover-bar").style.width = "0")}>
                  {text}
                  <span className="hover-bar absolute bottom-0 left-0 h-1 bg-green-600 transition-width duration-300 ease-in-out w-0"></span>
                </Link>
              </li>
            ))}

            {/* Cart Icon */}
            <li className="relative">
              <Link to="/cart">
                <FaShoppingCart size={24} className="text-green-600" />
                {cart?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                    {cart.length}
                  </span>
                )}
              </Link>
            </li>
          </ul>

          {/* Contact */}
          <div className="hidden md:flex items-center bg-green-600 text-white p-2 rounded-md">
            <FaPhoneAlt />
            <span className="ml-2">(+233) 0545086577</span>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 w-[250px] h-full bg-white shadow-lg transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-[1100]`}>
        <div className="flex justify-end p-4">
          <FaTimes className="text-green-600 text-2xl cursor-pointer" onClick={() => setMenuOpen(false)} />
        </div>
        <ul className="flex flex-col items-center gap-6 mt-6">
          {menuItems.map((text, index) => (
            <li key={index} className="w-full text-center">
              <Link
                to={text === "Home" ? "/" : `/${text.toLowerCase()}`}
                className="text-green-600 hover:text-green-800 font-bold text-lg p-2 block"
                onClick={() => {
                  setMenuOpen(false);
                  handleNavigation(text === "Home" ? "/" : `/${text.toLowerCase()}`);
                }}>
                {text}
              </Link>
            </li>
          ))}

          {/* Cart Link in Mobile */}
          <li className="relative text-center">
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 text-green-600 hover:text-green-800 font-bold text-lg">
              <FaShoppingCart />
              Cart
              {cart?.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 ml-1">
                  {cart.length}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
