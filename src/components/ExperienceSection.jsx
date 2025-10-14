import React, { useState } from "react";
import { FaPhoneAlt, FaSeedling, FaHistory, FaUsers } from "react-icons/fa";

const ExperienceSection = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/about";
    }, 1000);
  };

  return (
    <>
      {/* Full-Screen Spinner */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 z-50">
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

      {/* Experience Section */}
      <section className="relative flex flex-col lg:flex-row items-center gap-12 px-4 md:px-8 py-16 md:py-24 bg-gradient-to-br from-green-50 via-amber-50 to-white overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-200 rounded-full -translate-y-32 translate-x-32 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-200 rounded-full translate-y-24 -translate-x-24 opacity-30"></div>
        
        {/* Image Section */}
        <div className="relative w-full lg:w-1/2 flex justify-center">
          <div className="relative max-w-md">
            {/* Main Image */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <img
                src="/IMG-20250307-WA0007.jpg"
                alt="Nashma Agribusiness Team Experience"
                className="w-full h-auto object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent"></div>
            </div>
            
            {/* Floating stats cards */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 z-20 border border-green-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaHistory className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-800">10+</p>
                  <p className="text-sm text-green-600">Years Experience</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 z-20 border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <FaUsers className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-800">500+</p>
                  <p className="text-sm text-amber-600">Farmers Served</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="relative w-full lg:w-1/2 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <FaSeedling className="w-4 h-4" />
            Trusted Since 2014
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-6 leading-tight">
            Over <span className="text-amber-600">10 Years</span> of Agricultural Excellence
          </h2>
          
          <div className="w-20 h-1 bg-amber-500 mb-8 mx-auto lg:mx-0"></div>

          <p className="text-lg md:text-xl text-green-800 leading-relaxed mb-8">
            With a decade of unwavering dedication to <span className="font-semibold text-green-700">sustainable agriculture</span>, 
            we've been at the forefront of transforming farming practices in Ghana. Our journey has been marked by 
            innovation, community empowerment, and a deep commitment to environmental stewardship.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-green-700">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="font-medium">Pioneers in cocoa potash production</span>
            </div>
            <div className="flex items-center gap-3 text-green-700">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="font-medium">Sustainable farming solutions</span>
            </div>
            <div className="flex items-center gap-3 text-green-700">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="font-medium">Community-focused initiatives</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={handleClick}
              className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[180px]"
            >
              <div className="relative">
                {loading && (
                  <div className="absolute -top-2 -left-2 w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <FaPhoneAlt className={`w-5 h-5 ${loading ? 'opacity-0' : 'opacity-100'}`} />
              </div>
              <span className={loading ? 'opacity-0' : 'opacity-100'}>
                Read More
              </span>
            </button>

            <button className="group flex items-center justify-center gap-3 px-8 py-4 border-2 border-green-600 text-green-700 text-lg font-semibold rounded-xl hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 min-w-[180px]">
              <FaUsers className="w-5 h-5" />
              Our Story
            </button>
          </div>

          {/* Bottom decorative element */}
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-green-200 rounded-full opacity-20"></div>
        </div>
      </section>
    </>
  );
};

export default ExperienceSection;