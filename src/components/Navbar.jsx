import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaBars } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [loading, setLoading] = useState(false);

  // Update screen size state on window resize
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false); // Simulate navigation completion
    }, 1000); // Simulate a 1-second load time
  };

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center h-screen bg-white z-100 fixed inset-0">
          <div>
            <img src="/nashma-removebg-preview.png" alt="Logo" className="h-20 w-20" />
          </div>
        </div>
      )}
      <nav className="bg-white text-green-600 p-4 fixed top-0 left-0 w-full shadow-md z-1000">
        <div className="container mx-auto flex justify-between items-center flex-wrap gap-4">
          {/* Logo Section */}
          <img src="/nashma-removebg-preview.png" alt="Logo" className="h-10 mr-4" />

          {/* Hamburger Icon */}
          <FaBars
            className="block md:hidden text-green-600 text-2xl cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />

          {/* Navigation Links */}
          <ul className={`flex flex-col md:flex-row items-center md:items-start ${isSmallScreen ? (menuOpen ? 'flex' : 'hidden') : 'flex'}`}>
            {["Home", "About", "Services", "Mission", "Contact"].map((text, index) => (
              <li key={index} className="relative">
                <Link
                  to={text === "Home" ? "/" : `/${text.toLowerCase()}`}
                  className="text-green-600 hover:text-green-800 font-bold text-base p-2 block relative"
                  onClick={() => {
                    if (isSmallScreen) setMenuOpen(false);
                    handleNavigation(text === "Home" ? "/" : `/${text.toLowerCase()}`);
                  }}
                  onMouseEnter={(e) => (e.currentTarget.querySelector(".hover-bar").style.width = "100%")}
                  onMouseLeave={(e) => (e.currentTarget.querySelector(".hover-bar").style.width = "0")}
                >
                  {text}
                  <span className="hover-bar absolute bottom-0 left-0 h-1 bg-green-600 transition-width duration-300 ease-in-out w-0"></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Contact Number */}
          <div className="flex items-center bg-green-600 text-white p-2 rounded-md">
            <FaPhoneAlt />
            <span className="ml-2">(+233) 0545086577</span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
