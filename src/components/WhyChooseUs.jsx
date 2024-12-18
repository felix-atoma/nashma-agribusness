import React, { useState } from "react";
import { FiPhoneCall } from "react-icons/fi";
import { FaHandsHelping, FaLightbulb, FaSeedling } from "react-icons/fa";
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

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center fixed inset-0 bg-white z-50">
          <div className="relative flex justify-center items-center w-24 h-24">
            <img
              src="src/assets/logo (2) (1).png"
              alt="Logo"
              className="h-12 w-12"
            />
            <div className="absolute inset-0 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-center p-10 bg-white h-screen gap-6">
        <div className="flex-1 pr-6">
          <h1 className="text-3xl text-green-600 mb-4">Why you should choose us</h1>
          <p className="text-gray-700 mb-4">
            In rural Ghanaian cocoa communities, women and youth face idle
            months during off-seasons, while 70-90% of cocoa pods rot, harming
            environments and health.
          </p>
          <p className="text-gray-700 mb-4">
            Our innovative solution empowers women and youth to transform cocoa
            waste into valuable potash, generating income and sustainability.
          </p>
          <ul className="list-none p-0 mb-4">
            <li className="flex items-center gap-2 text-gray-700 mb-2">
              <FaHandsHelping className="text-green-600 text-xl" /> Economic opportunities for
              marginalized groups.
            </li>
            <li className="flex items-center gap-2 text-gray-700 mb-2">
              <FaLightbulb className="text-green-600 text-xl" /> Reduced environmental hazards.
            </li>
            <li className="flex items-center gap-2 text-gray-700 mb-2">
              <FaSeedling className="text-green-600 text-xl" /> Sustainable cocoa production.
            </li>
          </ul>
          <p className="text-gray-700 mb-4">
            Join Nashma Agribusiness in unlocking cocoa waste potential,
            transforming rural livelihoods.
          </p>
          <button
            className="flex items-center bg-green-600 text-white rounded-lg px-6 py-3 mt-4 transition-colors duration-300 hover:bg-green-700"
            onClick={handleButtonClick}
          >
            <FiPhoneCall className="mr-2 text-lg" />
            (+233) 0545086577/0243241649
          </button>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <img
            src="/20241112_165130.jpg"
            alt="Agribusiness Illustration"
            className="w-full max-h-80 object-cover rounded-lg"
          />
        </div>
      </div>
    </>
  );
};

export default WhyChooseUs;
