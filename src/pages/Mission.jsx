import React from "react";
import {
  FaSeedling,
  FaHandsHelping,
  FaBullhorn,
  FaHandshake,
  FaShoppingCart,
  FaGlobeAfrica,
} from "react-icons/fa";

const Mission = () => {
  const missionCards = [
    {
      title: "Empowering Youth",
      content:
        "Provide young people with skills and opportunities to thrive in sustainable agriculture.",
      icon: <FaSeedling />,
    },
    {
      title: "Empowering Women",
      content:
        "Support women in agriculture with training and market access for economic independence.",
      icon: <FaHandsHelping />,
    },
    {
      title: "Awareness",
      content:
        "Create brand visibility and educate about sustainable agricultural practices.",
      icon: <FaBullhorn />,
    },
    {
      title: "Engagement",
      content: "Build trust by providing valuable content and fostering connections.",
      icon: <FaHandshake />,
    },
    {
      title: "Market Access",
      content: "Facilitate direct market access to drive inquiries and increase sales.",
      icon: <FaShoppingCart />,
    },
    {
      title: "Global Impact",
      content:
        "Promote sustainable agricultural practices worldwide for a better future.",
      icon: <FaGlobeAfrica />,
    },
  ];

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <h1 className="text-center text-4xl font-bold text-green-600 mb-8">Our Mission</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {missionCards.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 transition-transform duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg text-center"
          >
            <div className="text-3xl text-green-700 mb-4">{item.icon}</div>
            <h2 className="text-lg font-bold text-green-700 mb-2">{item.title}</h2>
            <p className="text-gray-600 text-sm">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mission;
