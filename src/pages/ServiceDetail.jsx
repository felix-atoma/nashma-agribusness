import React from "react";
import { useParams } from "react-router-dom";

const ServiceDetail = () => {
  const { serviceId } = useParams();

  // Hardcoded data; Replace with API call or Context logic as needed
  const services = {
    "potash-production": {
      title: "Potash Production",
      description:
        "Detailed description of Potash Production service goes here.",
      image: "/20241126_165204.jpg",
    },
    "global-bulk-supply": {
      title: "Global Bulk Supply",
      description:
        "Detailed description of Global Bulk Supply service goes here.",
      image: "/20241126_165239.jpg",
    },
    "skills-training": {
      title: "Skills Training in Potash and African Black Soap",
      description:
        "Learn how to create potash and African black soap with step-by-step training.",
      image: "/20241126_165300.jpg",
    },
    "sustainable-farming-workshops": {
      title: "Sustainable Farming Workshops",
      description:
        "Join our workshops to learn cutting-edge, eco-friendly farming methods.",
      image: "/sustainable_farming_workshop.jpg",
    },
    "eco-friendly-packaging": {
      title: "Eco-Friendly Packaging Solutions",
      description:
        "Explore our sustainable packaging solutions for industrial needs.",
      image: "/eco_friendly_packaging.jpg",
    },
  };

  const service = services[serviceId];

  if (!service) {
    return <p className="text-center text-red-600">Service not found!</p>;
  }

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-gray-800">{service.title}</h1>
      <img
        src={service.image}
        alt={service.title}
        className="max-w-full h-auto my-4"
      />
      <p className="text-lg text-gray-600 leading-relaxed">
        {service.description}
      </p>
    </div>
  );
};

export default ServiceDetail;
