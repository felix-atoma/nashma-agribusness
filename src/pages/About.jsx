import React from "react";
import { Helmet } from "react-helmet-async";
import {
  FaSeedling,
  FaShippingFast,
  FaChalkboardTeacher,
  FaHandsHelping,
} from "react-icons/fa";

const About = () => {
  return (
    <div className="overflow-hidden">
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>About Nashma Agribusiness — Empowering Sustainable Cocoa Communities in Ghana</title>
        <meta
          name="description"
          content="Learn about Nashma Agribusiness, a Ghana-based social enterprise turning cocoa waste into organic potash and black soap. We empower women, youth, and persons with disabilities through sustainable agribusiness training and market access."
        />
        <meta
          name="keywords"
          content="Nashma Agribusiness, about Nashma, Ghana agribusiness, cocoa waste recycling, sustainable farming, organic potash, black soap, empowerment, Ashanti Region, social enterprise"
        />
        <meta name="author" content="Nashma Agribusiness" />
        <meta property="og:title" content="About Nashma Agribusiness — Sustainable Cocoa Innovation in Ghana" />
        <meta
          property="og:description"
          content="Nashma Agribusiness empowers Ghanaian communities to transform cocoa waste into organic potash and natural products, promoting sustainability and inclusion."
        />
        <meta property="og:image" content="/20241112_170250.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_GB" />
      </Helmet>

      {/* Hero Image Section */}
      <div className="relative w-full h-[60vh] sm:h-[80vh] lg:h-[90vh]">
        <img
          src="/20241112_170250.jpg"
          alt="NASHMA banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center text-white text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold px-4 bg-black/40">
          Imagine a world where waste becomes wealth.
        </div>
      </div>

      {/* Spacer */}
      <div className="h-8 bg-white"></div>

      {/* Content Section */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full px-6 md:px-12 lg:px-20 gap-8">
        {/* Left Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/20241128_150316.jpg"
            alt="Nashma process of turning cocoa waste into potash"
            className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Right Content */}
        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-snug">
            Empowering Communities Through Innovation
          </h2>

          {[
            {
              icon: <FaHandsHelping className="text-green-600 text-2xl" />,
              text: "At NASHMA, we empower women, young people, and individuals with disabilities to turn cocoa waste into wealth by converting cocoa pods into potash and connecting them with direct markets.",
            },
            {
              icon: <FaChalkboardTeacher className="text-green-600 text-2xl" />,
              text: "We provide training and set up processing facilities, ensuring our beneficiaries can focus on production without the burden of searching for buyers.",
            },
            {
              icon: <FaSeedling className="text-green-600 text-2xl" />,
              text: "Potash produced by our communities is used in industries such as black soap production, water treatment, and food preservation.",
            },
            {
              icon: <FaShippingFast className="text-green-600 text-2xl" />,
              text: "We handle logistics and ensure the processed potash reaches diverse industries, enabling sustainable income for our partners.",
            },
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              {item.icon}
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}

          {/* Read More Button */}
          <button
            className="mt-4 py-2 px-6 bg-green-600 text-white text-lg font-bold rounded shadow-lg hover:bg-green-700 transition-transform duration-300 ease-in-out transform hover:scale-105"
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
