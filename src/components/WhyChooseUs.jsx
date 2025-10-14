import React, { useState } from "react";
import { FiPhoneCall } from "react-icons/fi";
import { FaHandsHelping, FaLightbulb, FaSeedling, FaRecycle, FaUsers, FaChartLine, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const WhyChooseUs = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/about");
      setLoading(false);
    }, 1000);
  };

  const features = [
    {
      icon: <FaHandsHelping className="w-6 h-6" />,
      title: "Community Empowerment",
      description: "Economic opportunities for marginalized groups",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      delay: "0"
    },
    {
      icon: <FaRecycle className="w-6 h-6" />,
      title: "Environmental Care",
      description: "Reduced environmental hazards from cocoa waste",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      delay: "100"
    },
    {
      icon: <FaSeedling className="w-6 h-6" />,
      title: "Sustainable Farming",
      description: "Eco-friendly cocoa production practices",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      delay: "200"
    },
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: "Inclusive Growth",
      description: "Supporting women, youth, and persons with disabilities",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
      delay: "300"
    }
  ];

  return (
    <>
      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 z-50">
          <div className="relative flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-32 h-32 mb-4">
              <img
                src="/src/assets/logo (2) (1).png"
                alt="Nashma Agribusiness Logo"
                className="w-16 h-16 z-10"
              />
              <div className="absolute inset-0 border-4 border-green-500 border-t-amber-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 border-4 border-amber-500 border-t-green-500 rounded-full animate-spin animation-delay-1000"></div>
            </div>
            <p className="text-green-800 font-semibold text-lg">Taking you to About...</p>
          </div>
        </div>
      )}

      {/* Main Section */}
      <div className="relative py-16 md:py-24 px-4 bg-gradient-to-br from-white via-green-50 to-amber-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full -translate-y-48 translate-x-48 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-200 rounded-full translate-y-40 -translate-x-40 opacity-30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Text Content */}
            <div className="w-full lg:w-1/2">
              {/* Header */}
              <div className="text-center lg:text-left mb-8">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <FaChartLine className="w-4 h-4" />
                  Why Partner With Us
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4 leading-tight">
                  Transforming <span className="text-amber-600">Cocoa Waste</span> Into Opportunity
                </h1>
                <div className="w-20 h-1 bg-amber-500 mb-6 mx-auto lg:mx-0"></div>
              </div>

              {/* Problem Statement */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 mb-8">
                <p className="text-green-800 leading-relaxed mb-4">
                  In rural Ghanaian cocoa communities, <span className="font-semibold text-amber-600">women and youth face idle months</span> during off-seasons, while <span className="font-semibold text-green-700">70-90% of cocoa pods rot</span>, harming environments and community health.
                </p>
                <p className="text-green-800 leading-relaxed">
                  Our <span className="font-semibold text-green-700">innovative solution</span> empowers communities to transform cocoa waste into valuable potash, generating sustainable income and environmental benefits.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className={`${feature.bgColor} rounded-xl p-4 border border-transparent hover:border-green-200 transition-all duration-300 group hover:shadow-lg`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-900 mb-1">{feature.title}</h3>
                        <p className="text-sm text-green-700">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to Action */}
              <div className="text-center lg:text-left">
                <p className="text-green-800 mb-6 text-lg font-medium">
                  Join Nashma Agribusiness in unlocking cocoa waste potential and transforming rural livelihoods.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleButtonClick}
                    className="group flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[280px]"
                  >
                    <div className="relative">
                      <FiPhoneCall className="w-5 h-5" />
                    </div>
                    <span>Call Now</span>
                    <FaArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 min-w-[280px]">
                    <p className="text-amber-800 font-semibold text-center">
                      (+233) 0545086577
                    </p>
                    <p className="text-amber-700 text-sm text-center">
                      0243241649
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                {/* Main Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <img
                    src="\IMG-20250307-WA0011.jpg"
                    alt="Nashma Agribusiness Cocoa Farming"
                    className="w-full h-auto object-cover"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent"></div>
                </div>

                {/* Floating Stats Card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6 border border-green-100">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
                      <FaSeedling className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-800">70%</p>
                    <p className="text-sm text-green-600 font-medium">Waste Reduction</p>
                  </div>
                </div>

                {/* Floating Element */}
                <div className="absolute -top-6 -right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-lg p-4">
                  <div className="text-center">
                    <FaRecycle className="w-8 h-8 mb-2 mx-auto" />
                    <p className="text-sm font-semibold">Sustainable Solution</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhyChooseUs;