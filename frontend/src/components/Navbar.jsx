import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaPhoneAlt, FaBars, FaTimes, FaSeedling, FaLeaf,
  FaRecycle, FaFlask, FaGraduationCap, FaGlobe, FaArrowRight,
} from "react-icons/fa";
import { ShoppingCart, User, LogOut, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const serviceItems = [
    { name: "Cocoa Potash Production", path: "/services", icon: <FaRecycle className="w-4 h-4" />, color: "text-green-600" },
    { name: "African Black Soap", path: "/services", icon: <FaFlask className="w-4 h-4" />, color: "text-amber-600", isNew: true },
    { name: "Women & Youth Training", path: "/services", icon: <FaGraduationCap className="w-4 h-4" />, color: "text-rose-600" },
    { name: "Global Bulk Supply", path: "/services", icon: <FaGlobe className="w-4 h-4" />, color: "text-blue-600" },
    { name: "Farming Workshops", path: "/services", icon: <FaLeaf className="w-4 h-4" />, color: "text-teal-600" },
  ];

  const { cart, loading: cartLoading } = useCart();
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Add safety checks and improved cart handling
  const safeCart = cart || { itemCount: 0, items: [], total: 0 };
  const safeUser = user || {};
  const isAuthenticated = user !== null && user !== undefined;
  const cartItemCount = safeCart.itemCount || safeCart.items?.length || 0;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-menu-container")) {
        setUserMenuOpen(false);
      }
      if (!e.target.closest(".services-menu-container")) {
        setServicesOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleNavigation = (path) => {
    setLoading(true);
    setMenuOpen(false);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleCartClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate("/login", {
        state: {
          from: "cart",
          returnTo: "/cart",
          message: "Please login to view your cart",
        },
      });
      return;
    }
    // If authenticated, navigation will proceed normally via Link
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Products", path: "/products" },
    { name: "Contact", path: "/contact" },
  ];

  // Custom Cart Icon Component
  const CartIconWithBadge = ({ className = "", showText = false }) => (
    <div className="relative">
      <ShoppingCart className={`w-5 h-5 ${className}`} />
      {cartItemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] text-[10px] shadow-lg border border-white">
          {cartItemCount > 99 ? "99+" : cartItemCount}
        </span>
      )}
      {showText && <span className="ml-2">Cart</span>}
    </div>
  );

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-50 to-amber-50 z-[100] fixed inset-0">
          <div className="relative flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-32 h-32 mb-4">
              <img
                src="/nashma-removebg-preview.png"
                alt="Nashma Agribusiness Logo"
                className="w-16 h-16 z-10"
              />
              <div className="absolute inset-0 border-4 border-green-500 border-t-amber-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 border-4 border-amber-500 border-t-green-500 rounded-full animate-spin animation-delay-1000"></div>
            </div>
            <p className="text-green-800 font-semibold text-lg">Loading...</p>
          </div>
        </div>
      )}

      <nav className={`bg-white text-green-900 p-4 fixed top-0 left-0 w-full transition-all duration-300 z-[1000] ${
        scrolled 
          ? 'shadow-2xl bg-white/95 backdrop-blur-sm border-b border-green-100' 
          : 'shadow-md'
      }`}>
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            onClick={() => handleNavigation("/")}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <img
                src="/nashma-removebg-preview.png"
                alt="Nashma Agribusiness Logo"
                className="h-12 w-12 group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping opacity-75"></div>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg text-green-900 leading-tight">Nashma Agribusiness</div>
              <div className="text-xs text-green-600 font-medium">Growing Sustainable Futures</div>
            </div>
          </Link>

          {/* Hamburger */}
          <div className="md:hidden">
            {menuOpen ? (
              <FaTimes
                className="text-green-700 text-2xl cursor-pointer hover:text-amber-600 transition-colors"
                onClick={() => setMenuOpen(false)}
              />
            ) : (
              <FaBars
                className="text-green-700 text-2xl cursor-pointer hover:text-amber-600 transition-colors"
                onClick={() => setMenuOpen(true)}
              />
            )}
          </div>

          {/* Desktop Links */}
          <ul className="hidden md:flex space-x-1 items-center">
            {/* Home & About */}
            {menuItems.slice(0, 2).map((item, index) => (
              <li key={index} className="relative">
                <Link
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-semibold text-green-800 hover:text-green-900 transition-all duration-300 ${
                    location.pathname === item.path
                      ? "bg-green-100 text-green-900"
                      : "hover:bg-green-50"
                  }`}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.name}
                </Link>
              </li>
            ))}

            {/* Services Dropdown */}
            <li className="relative services-menu-container">
              <button
                onClick={() => setServicesOpen((v) => !v)}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold text-green-800 hover:text-green-900 transition-all duration-300 ${
                  location.pathname === "/services"
                    ? "bg-green-100 text-green-900"
                    : "hover:bg-green-50"
                }`}
              >
                Services
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-green-100 py-2 z-50">
                  <div className="px-4 py-2 text-xs font-bold text-green-500 uppercase tracking-widest border-b border-green-50 mb-1">
                    Our Services
                  </div>
                  {serviceItems.map((svc, i) => (
                    <Link
                      key={i}
                      to={svc.path}
                      onClick={() => { setServicesOpen(false); handleNavigation(svc.path); }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors group"
                    >
                      <span className={`${svc.color} group-hover:scale-110 transition-transform`}>
                        {svc.icon}
                      </span>
                      <span className="text-sm text-green-800 font-medium flex-1">{svc.name}</span>
                      {svc.isNew && (
                        <span className="bg-amber-500 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </Link>
                  ))}
                  <div className="border-t border-green-50 mt-1 pt-1">
                    <Link
                      to="/services"
                      onClick={() => { setServicesOpen(false); handleNavigation("/services"); }}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-green-700 hover:text-green-900 hover:bg-green-50 transition-colors"
                    >
                      <FaArrowRight className="w-3.5 h-3.5" />
                      View All Services
                    </Link>
                  </div>
                </div>
              )}
            </li>

            {/* Products & Contact */}
            {menuItems.slice(2).map((item, index) => (
              <li key={index} className="relative">
                <Link
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-semibold text-green-800 hover:text-green-900 transition-all duration-300 ${
                    location.pathname === item.path
                      ? "bg-green-100 text-green-900"
                      : "hover:bg-green-50"
                  }`}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.name}
                </Link>
              </li>
            ))}

            {/* Cart Icon */}
            <li className="relative ml-2">
              <Link 
                to="/cart" 
                onClick={handleCartClick} 
                className="flex items-center p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-900 transition-all duration-300 group"
              >
                <CartIconWithBadge />
              </Link>
            </li>

            {/* User Menu */}
            <li className="relative user-menu-container ml-2">
              {!authLoading && (
                <>
                  {isAuthenticated ? (
                    <div className="relative">
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center space-x-2 p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-900 transition-all duration-300 group"
                      >
                        <User className="w-5 h-5" />
                        <span className="hidden lg:inline font-semibold max-w-[120px] truncate">
                          {safeUser?.firstName || safeUser?.name?.split(" ")[0] || "Account"}
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* User Dropdown */}
                      {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-green-100">
                          <div className="px-4 py-3 text-sm text-green-800 border-b border-green-100">
                            <div className="font-semibold truncate">
                              {safeUser?.name || `${safeUser?.firstName} ${safeUser?.lastName}`}
                            </div>
                            <div className="text-green-600 text-xs truncate">{safeUser?.email}</div>
                          </div>
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-3 text-sm text-green-700 hover:bg-green-50 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User className="w-4 h-4 mr-3" />
                            Profile
                          </Link>
                          <Link
                            to="/orders"
                            className="flex items-center px-4 py-3 text-sm text-green-700 hover:bg-green-50 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <FaLeaf className="w-4 h-4 mr-3" />
                            Orders
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center px-4 py-3 text-sm text-green-700 hover:bg-green-50 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                          </Link>
                          <div className="border-t border-green-100 mt-2 pt-2">
                            <button
                              onClick={handleLogout}
                              className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <LogOut className="w-4 h-4 mr-3" />
                              Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Link
                        to="/login"
                        className="px-4 py-2 text-green-700 hover:text-green-900 font-semibold transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl font-semibold"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </>
              )}
            </li>
          </ul>

          {/* Contact */}
          <div className="hidden lg:flex items-center bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
            <FaPhoneAlt className="w-4 h-4" />
            <span className="ml-2 font-semibold">(+233) 0545086577</span>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 w-[300px] h-full bg-white shadow-2xl transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-[1100] border-r border-green-100`}
      >
        <div className="flex justify-between items-center p-6 border-b border-green-100 bg-gradient-to-r from-green-50 to-amber-50">
          <Link 
            to="/" 
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3"
          >
            <img
              src="/nashma-removebg-preview.png"
              alt="Nashma Agribusiness Logo"
              className="h-10 w-10"
            />
            <div>
              <div className="font-bold text-green-900">Nashma Agribusiness</div>
              <div className="text-xs text-green-600">Growing Sustainable Futures</div>
            </div>
          </Link>
          <FaTimes
            className="text-green-700 text-2xl cursor-pointer hover:text-amber-600 transition-colors"
            onClick={() => setMenuOpen(false)}
          />
        </div>

        {/* User section in mobile */}
        {!authLoading && (
          <div className="p-6 border-b border-green-100 bg-white">
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <User className="text-green-600 w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-green-900 truncate">
                      {safeUser?.name || `${safeUser?.firstName} ${safeUser?.lastName}`}
                    </div>
                    <div className="text-sm text-green-600 truncate">
                      {safeUser?.email}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/profile"
                    className="flex-1 text-center bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="flex-1 text-center bg-amber-100 text-amber-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Orders
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block text-center bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block text-center border-2 border-green-600 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}

        <ul className="flex flex-col py-4">
          {/* Home & About */}
          {menuItems.slice(0, 2).map((item, index) => (
            <li key={index} className="border-b border-green-50">
              <Link
                to={item.path}
                className={`flex items-center px-6 py-4 text-green-800 hover:text-green-900 hover:bg-green-50 font-semibold text-base transition-colors ${
                  location.pathname === item.path ? "bg-green-50 text-green-900 border-r-4 border-amber-500" : ""
                }`}
                onClick={() => { setMenuOpen(false); handleNavigation(item.path); }}
              >
                {item.name}
              </Link>
            </li>
          ))}

          {/* Services with sub-items on mobile */}
          <li className="border-b border-green-50">
            <Link
              to="/services"
              className={`flex items-center px-6 py-4 text-green-800 hover:text-green-900 hover:bg-green-50 font-semibold text-base transition-colors ${
                location.pathname === "/services" ? "bg-green-50 text-green-900 border-r-4 border-amber-500" : ""
              }`}
              onClick={() => { setMenuOpen(false); handleNavigation("/services"); }}
            >
              Services
            </Link>
            <div className="px-6 pb-2 space-y-1">
              {serviceItems.map((svc, i) => (
                <Link
                  key={i}
                  to={svc.path}
                  onClick={() => { setMenuOpen(false); }}
                  className="flex items-center gap-2 py-1.5 text-sm text-green-600 hover:text-green-800 transition-colors"
                >
                  <span className={svc.color}>{svc.icon}</span>
                  {svc.name}
                  {svc.isNew && (
                    <span className="bg-amber-500 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full">New</span>
                  )}
                </Link>
              ))}
            </div>
          </li>

          {/* Products & Contact */}
          {menuItems.slice(2).map((item, index) => (
            <li key={index} className="border-b border-green-50 last:border-b-0">
              <Link
                to={item.path}
                className={`flex items-center px-6 py-4 text-green-800 hover:text-green-900 hover:bg-green-50 font-semibold text-base transition-colors ${
                  location.pathname === item.path ? "bg-green-50 text-green-900 border-r-4 border-amber-500" : ""
                }`}
                onClick={() => { setMenuOpen(false); handleNavigation(item.path); }}
              >
                {item.name}
              </Link>
            </li>
          ))}

          {/* Cart Link in Mobile */}
          <li className="border-b border-green-50">
            <Link
              to="/cart"
              onClick={(e) => {
                handleCartClick(e);
                setMenuOpen(false);
              }}
              className="flex items-center justify-between px-6 py-4 text-green-800 hover:text-green-900 hover:bg-green-50 font-semibold text-base transition-colors"
            >
              <CartIconWithBadge showText={true} />
            </Link>
          </li>

          {/* Logout for mobile */}
          {isAuthenticated && (
            <li className="border-b border-green-50">
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-4 px-6 py-4 text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold text-base w-full text-left transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </li>
          )}
        </ul>

        {/* Contact in mobile */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-xl shadow-lg">
            <FaPhoneAlt className="w-5 h-5" />
            <span className="ml-3 font-semibold">(+233) 0545086577</span>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[1050] md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;