import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaPhoneAlt, FaBars, FaTimes } from "react-icons/fa";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartIcon from '../pages/CartIcon'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [loading, setLoading] = useState(false);

  const { cart, loading: cartLoading } = useCart();
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Add safety checks
  const safeCart = cart || { itemCount: 0, items: [] };
  const safeUser = user || {};
  const isAuthenticated = user !== null && user !== undefined;

  console.log('Navbar - user:', user, 'cart:', cart); // Debug log

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-menu-container")) {
        setUserMenuOpen(false);
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
          message: "Please login to view your cart",
        },
      });
    }
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
  };

  const menuItems = ["Home", "About", "Services", "Products", "Contact"];

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center h-screen bg-white z-[100] fixed inset-0">
          <img
            src="/nashma-removebg-preview.png"
            alt="Logo"
            className="h-20 w-20"
          />
        </div>
      )}

      <nav className="bg-white text-green-600 p-4 fixed top-0 left-0 w-full shadow-md z-[1000]">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" onClick={() => handleNavigation("/")}>
            <img
              src="/nashma-removebg-preview.png"
              alt="Logo"
              className="h-10"
            />
          </Link>

          {/* Hamburger */}
          <div className="md:hidden">
            {menuOpen ? (
              <FaTimes
                className="text-green-600 text-2xl cursor-pointer"
                onClick={() => setMenuOpen(false)}
              />
            ) : (
              <FaBars
                className="text-green-600 text-2xl cursor-pointer"
                onClick={() => setMenuOpen(true)}
              />
            )}
          </div>

          {/* Desktop Links */}
          <ul className="hidden md:flex space-x-6 items-center">
            {menuItems.map((text, index) => (
              <li key={index} className="relative">
                <Link
                  to={text === "Home" ? "/" : `/${text.toLowerCase()}`}
                  className="text-green-600 hover:text-green-800 font-bold text-base relative"
                  onClick={() =>
                    handleNavigation(text === "Home" ? "/" : `/${text.toLowerCase()}`)
                  }
                  onMouseEnter={(e) =>
                    (e.currentTarget.querySelector(".hover-bar").style.width =
                      "100%")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.querySelector(".hover-bar").style.width =
                      "0")
                  }
                >
                  {text}
                  <span className="hover-bar absolute bottom-0 left-0 h-1 bg-green-600 transition-width duration-300 ease-in-out w-0"></span>
                </Link>
              </li>
            ))}

            {/* Cart Icon */}
            <li className="relative">
              <Link to="/cart" onClick={handleCartClick} className="p-2">
                <CartIcon />
              </Link>
            </li>

            {/* User Menu */}
            <li className="relative user-menu-container">
              {!authLoading && (
                <>
                  {isAuthenticated ? (
                    <div className="relative">
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center space-x-2 text-green-600 hover:text-green-800 font-medium"
                      >
                        <User className="w-5 h-5" />
                        <span className="hidden lg:inline">
                          {safeUser?.firstName ||
                            safeUser?.name?.split(" ")[0] ||
                            "Account"}
                        </span>
                      </button>

                      {/* User Dropdown */}
                      {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                          <div className="px-4 py-2 text-sm text-gray-700 border-b">
                            <div className="font-medium">
                              {safeUser?.name || `${safeUser?.firstName} ${safeUser?.lastName}`}
                            </div>
                            <div className="text-gray-500">{safeUser?.email}</div>
                          </div>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Profile
                          </Link>
                          <Link
                            to="/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Orders
                          </Link>
                          <Link
                            to="/settings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Settings
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <LogOut className="inline mr-2 w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Link
                        to="/login"
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
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
          <div className="hidden lg:flex items-center bg-green-600 text-white p-2 rounded-md">
            <FaPhoneAlt />
            <span className="ml-2">(+233) 0545086577</span>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 w-[280px] h-full bg-white shadow-lg transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-[1100]`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <img
            src="/nashma-removebg-preview.png"
            alt="Logo"
            className="h-8"
          />
          <FaTimes
            className="text-green-600 text-2xl cursor-pointer"
            onClick={() => setMenuOpen(false)}
          />
        </div>

        {/* User section in mobile */}
        {!authLoading && (
          <div className="p-4 border-b">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="text-green-600 w-5 h-5" />
                  <div>
                    <div className="font-medium text-gray-800">
                      {safeUser?.name ||
                        `${safeUser?.firstName} ${safeUser?.lastName}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {safeUser?.email}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to="/profile"
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                    onClick={() => setMenuOpen(false)}
                  >
                    Orders
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block text-center bg-green-600 text-white py-2 rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block text-center border border-green-600 text-green-600 py-2 rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}

        <ul className="flex flex-col mt-6">
          {menuItems.map((text, index) => (
            <li key={index} className="border-b border-gray-100">
              <Link
                to={text === "Home" ? "/" : `/${text.toLowerCase()}`}
                className="text-green-600 hover:text-green-800 hover:bg-green-50 font-bold text-lg p-4 block transition-colors"
                onClick={() => {
                  setMenuOpen(false);
                  handleNavigation(text === "Home" ? "/" : `/${text.toLowerCase()}`);
                }}
              >
                {text}
              </Link>
            </li>
          ))}

          {/* Cart Link in Mobile */}
          <li className="border-b border-gray-100">
            <Link
              to="/cart"
              onClick={(e) => {
                handleCartClick(e);
                setMenuOpen(false);
              }}
              className="flex items-center justify-between text-green-600 hover:text-green-800 hover:bg-green-50 font-bold text-lg p-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
              </div>
              {safeCart.itemCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {safeCart.itemCount > 99 ? "99+" : safeCart.itemCount}
                </span>
              )}
            </Link>
          </li>

          {/* Logout for mobile */}
          {isAuthenticated && (
            <li className="border-b border-gray-100">
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 text-red-600 hover:text-red-800 hover:bg-red-50 font-bold text-lg p-4 w-full text-left transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </li>
          )}
        </ul>

        {/* Contact in mobile */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-center bg-green-600 text-white p-3 rounded-md">
            <FaPhoneAlt />
            <span className="ml-2">(+233) 0545086577</span>
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