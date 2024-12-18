import React from "react";
import {
  FaSeedling,
  FaShippingFast,
  FaChalkboardTeacher,
  FaHandsHelping,
} from "react-icons/fa";

const About = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Full-width image */}
      <div className="w-full h-90vh overflow-hidden relative">
        <img
          src="/20241112_170250.jpg"
          alt="NASHMA banner"
          className="w-full h-full object-cover"
        />
        {/* About text in the center of the image */}
        <div className="absolute inset-0 flex items-center justify-center text-white text-center font-bold text-3xl z-10">
          Imagine a world where waste becomes wealth.
        </div>
      </div>

      {/* Add a gap between sections */}
      <div className="h-8 bg-white"></div>

      {/* Full-page width: photo on the left, text on the right */}
      <div className="flex flex-wrap w-full items-start justify-between px-4">
        {/* Left Image */}
        <div className="flex-1 max-w-md h-44vw overflow-hidden relative">
          <img
            src="/20241128_150316.jpg"
            alt="NASHMA process"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Right Text */}
        <div className="flex-1 max-w-md p-4 text-left">
          <h2 className="text-2.5xl font-bold mb-6 text-gray-800">
            Empowering Communities Through Innovation
          </h2>
          <div className="flex items-start gap-4 mb-6">
            <FaHandsHelping className="text-2xl text-green-600" />
            <p className="text-lg leading-6 text-gray-800">
              At NASHMA, we empower women, young people, and individuals with
              disabilities to turn cocoa waste into wealth by converting cocoa
              pods into potash and connecting them with direct markets.
            </p>
          </div>
          <div className="flex items-start gap-4 mb-6">
            <FaChalkboardTeacher className="text-2xl text-green-600" />
            <p className="text-lg leading-6 text-gray-800">
              We provide training and set up processing facilities, ensuring
              our beneficiaries can focus on production without the burden of
              searching for buyers.
            </p>
          </div>
          <div className="flex items-start gap-4 mb-6">
            <FaSeedling className="text-2xl text-green-600" />
            <p className="text-lg leading-6 text-gray-800">
              Potash produced by our communities is used in industries such as
              black soap production, water treatment, and food preservation.
            </p>
          </div>
          <div className="flex items-start gap-4 mb-6">
            <FaShippingFast className="text-2xl text-green-600" />
            <p className="text-lg leading-6 text-gray-800">
              We handle logistics and ensure the processed potash reaches
              diverse industries, enabling sustainable income for our partners.
            </p>
          </div>

          {/* Read More About Us Button */}
          <button
            className="mt-auto py-2 px-6 bg-green-600 text-white text-lg font-bold rounded hover:bg-green-700 transition-transform duration-300 ease-in-out"
            onClick={() => console.log("Navigating to more about us...")}
          >
            Read More About Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
