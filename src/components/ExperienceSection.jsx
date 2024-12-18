import React, { useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";

const ExperienceSection = () => {
  const [loading, setLoading] = useState(false);

  // Function to handle the button click, show spinner, and navigate
  const handleClick = () => {
    setLoading(true); // Start the spinner animation
    setTimeout(() => {
      setLoading(false); // Stop the spinner
      window.location.href = "/about"; // Navigate to the About page
    }, 1000); // Simulate a 1-second load time for the spinner to show
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="relative flex items-center justify-center w-24 h-24">
            <img
              src="/nashma-removebg-preview.png"
              alt="Logo"
              className="w-12 h-12"
            />
            <div className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <section className="flex flex-wrap items-center gap-8 px-8 py-12 bg-gray-100">
        {/* Image Section */}
        <div className="flex-1">
          <img
            src="/20241112_164309.jpg" // Replace with the actual image path
            alt="Experience"
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Text Section */}
        <div className="flex-1 text-left text-gray-800">
          <h2 className="text-4xl font-bold mb-4">Over 10 Years of Experience</h2>
          <p className="text-lg leading-relaxed mb-6">
            With a decade of dedication to sustainable agriculture, we continue
            to support farmers and empower communities. Learn more about our
            journey and commitment.
          </p>
          <button
            onClick={handleClick}
            className="flex items-center gap-3 px-6 py-3 bg-green-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors"
          >
            {/* Spinner around the logo if loading */}
            <div className="relative">
              {loading && (
                <div className="absolute top-0 left-0 w-6 h-6 border-2 border-gray-200 border-t-white rounded-full animate-spin"></div>
              )}
              <FaPhoneAlt />
            </div>
            More About Us
          </button>
        </div>
      </section>
    </>
  );
};

export default ExperienceSection;
