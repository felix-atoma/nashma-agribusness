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
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="relative flex items-center justify-center w-24 h-24">
            <img
              src="/src/assets/logo (2) (1).png"
              alt="Logo"
              className="h-12 w-12"
            />
            <div className="absolute inset-0 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center gap-8 px-6 py-12 bg-white">
        {/* Text Section */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl text-green-600 font-bold mb-4">
            Why Choose Us?
          </h1>
          <p className="text-gray-700 leading-relaxed mb-4">
            In rural Ghanaian cocoa communities, women and youth face idle months during off-seasons, while 70-90% of cocoa pods rot, harming environments and health.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our innovative solution empowers women and youth to transform cocoa waste into valuable potash, generating income and sustainability.
          </p>

          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-gray-700">
              <FaHandsHelping className="text-green-600 text-xl" />
              Economic opportunities for marginalized groups.
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <FaLightbulb className="text-green-600 text-xl" />
              Reduced environmental hazards.
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <FaSeedling className="text-green-600 text-xl" />
              Sustainable cocoa production.
            </li>
          </ul>

          <p className="text-gray-700 mt-6">
            Join Nashma Agribusiness in unlocking cocoa waste potential, transforming rural livelihoods.
          </p>

          <button
            className="mt-6 flex items-center justify-center gap-3 bg-green-600 text-white text-lg font-semibold px-6 py-3 rounded-lg w-full md:w-auto transition duration-300 hover:bg-green-700"
            onClick={handleButtonClick}
          >
            <FiPhoneCall className="text-xl" />
            (+233) 0545086577 / 0243241649
          </button>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="\IMG-20250307-WA0011.jpg"
            alt="Agribusiness"
            className="w-full max-w-sm md:max-w-md lg:max-w-lg object-cover rounded-lg shadow-md"
          />
        </div>
      </div>
    </>
  );
};

export default WhyChooseUs;
