import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";

const ServicesSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      image: "/20241126_165204.jpg", // Replace with actual image path for potash production
      title: "Potash Production",
      description:
        "We specialize in producing high-quality potash for agricultural and industrial use.",
      servicePath: "/services/potash-production",
    },
    {
      image: "/20241126_165239.jpg", // Replace with actual image path for bulk supply
      title: "Global Bulk Supply",
      description:
        "We ensure the efficient global supply of bulk products to meet diverse needs.",
      servicePath: "/services/global-bulk-supply",
    },
  ];

  const handleButtonClick = (servicePath) => {
    navigate(servicePath); // Navigate to the specific service page
  };

  return (
    <div className="p-10 bg-gray-100">
      <h2 className="text-4xl text-center text-gray-800 mb-10">Services We Provide</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {services.map((service, index) => (
          <div key={index} className="flex flex-col md:flex-row bg-green-100 rounded-lg shadow-md overflow-hidden">
            {/* Image */}
            <div className="flex-none w-1/3">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center p-6 w-full md:w-2/3">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <button
                onClick={() => handleButtonClick(service.servicePath)}
                className="flex items-center justify-center bg-green-600 text-white py-2 px-4 rounded transition duration-300 hover:bg-green-700"
              >
                <FaPhoneAlt className="mr-2" />
                Get This Service
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
