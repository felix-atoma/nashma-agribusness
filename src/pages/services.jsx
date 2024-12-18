import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: "potash-production",
      image: "/20241112_160941.jpg",
      title: "Potash Production",
      description:
        "We specialize in producing high-quality potash from cocoa pods, turning waste into wealth. Potash is used in various applications including black soap production, water treatment, and food preservation.",
    },
    {
      id: "global-bulk-supply",
      image: "/20241126_165239.jpg",
      title: "Global Bulk Supply",
      description:
        "We ensure the efficient global supply of bulk products, including potash, to meet diverse market needs. Our goal is to provide a direct market for producers without the hassle of searching for buyers.",
    },
    {
      id: "skills-training",
      image: "/20241112_162930.jpg",
      title: "Skills Training in Potash and African Black Soap",
      description:
        "Empowering communities with skills to produce potash and African black soap, fostering sustainable livelihoods and ensuring they can turn waste into wealth.",
    },
    {
      id: "sustainable-farming-workshops",
      image: "/20241112_163334.jpg",
      title: "Sustainable Farming Workshops",
      description:
        "Teaching modern and sustainable farming techniques to enhance productivity while protecting the environment. We aim to integrate these practices with potash ",
    },
  ];

  const handleButtonClick = (id) => {
    navigate(`/contact`); // Navigate to the dynamic route for the service
  };

  return (
    <div className="p-10 bg-gray-50">
      <h1 className="text-4xl font-bold text-green-700 text-center mb-10 mt-16">
        Our Expertise: Empowering Sustainable Solutions and Global Outreach
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-col bg-green-50 rounded-lg shadow-md overflow-hidden mb-5"
          >
            {/* Image */}
            <div className="flex-shrink-0 h-40 w-full">
              <img
                src={service.image}
                alt={service.title}
                className="object-cover h-full w-full"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <button
                onClick={() => handleButtonClick(service.id)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 focus:outline-none transition"
              >
                <FaPhoneAlt />
                Contact Us
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
