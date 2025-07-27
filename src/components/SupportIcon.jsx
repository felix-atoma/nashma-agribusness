// src/components/SupportIcon.jsx
import React from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SupportIcon = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/faq");
  };

  return (
    <div
      className="fixed bottom-16 left-4 z-50 cursor-pointer"
      onClick={handleClick}
      title="Need Help?"
    >
      <div className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300">
        <FaQuestionCircle size={24} />
      </div>
    </div>
  );
};

export default SupportIcon;
