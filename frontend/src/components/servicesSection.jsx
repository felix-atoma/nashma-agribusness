import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRecycle, FaFlask, FaGraduationCap, FaGlobe, FaLeaf,
  FaArrowRight, FaCheckCircle
} from "react-icons/fa";
import { analytics } from "../utils/analytics";

const services = [
  {
    id: "potash-production",
    title: "Cocoa Potash Production",
    shortDesc: "Premium organic potash from cocoa pods for agriculture, soap, and industry.",
    icon: <FaRecycle className="w-7 h-7" />,
    color: "from-green-500 to-emerald-600",
    bg: "bg-green-50",
    features: ["100% Organic", "Industrial grade", "Multiple uses"],
  },
  {
    id: "african-black-soap",
    title: "African Black Soap",
    shortDesc: "Authentic, chemical-free black soap made with our organic cocoa potash.",
    icon: <FaFlask className="w-7 h-7" />,
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    features: ["100% Natural", "Traditional recipe", "Wholesale & retail"],
    isNew: true,
  },
  {
    id: "skills-training",
    title: "Women & Youth Training",
    shortDesc: "Hands-on potash and soap-making training with market access guaranteed.",
    icon: <FaGraduationCap className="w-7 h-7" />,
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50",
    features: ["Potash & soap skills", "Facility access", "Market linkages"],
  },
  {
    id: "global-bulk-supply",
    title: "Global Bulk Supply",
    shortDesc: "We connect Ghanaian producers with international buyers — hassle-free logistics.",
    icon: <FaGlobe className="w-7 h-7" />,
    color: "from-blue-500 to-cyan-600",
    bg: "bg-blue-50",
    features: ["International shipping", "Direct buyer links", "Competitive pricing"],
  },
  {
    id: "sustainable-farming-workshops",
    title: "Farming Workshops",
    shortDesc: "Modern, eco-friendly farming techniques to boost yield and protect the land.",
    icon: <FaLeaf className="w-7 h-7" />,
    color: "from-teal-500 to-green-600",
    bg: "bg-teal-50",
    features: ["Organic methods", "Soil health", "Potash integration"],
  },
];

const ServicesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <FaRecycle className="w-4 h-4" />
            What We Offer
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-900 mb-4">
            Services We <span className="text-amber-600">Provide</span>
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mb-4" />
          <p className="text-lg text-green-700 max-w-2xl mx-auto">
            From producing organic cocoa potash and authentic African Black Soap to
            training women and youth — five ways we turn waste into lasting wealth.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className={`group relative ${service.bg} border border-transparent hover:border-green-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-400 transform hover:-translate-y-1 cursor-pointer`}
              onClick={() => {
                analytics.serviceInquiry(service.title);
                navigate("/services");
              }}
            >
              {/* New badge */}
              {service.isNew && (
                <span className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow">
                  New
                </span>
              )}

              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r ${service.color} text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-green-900 mb-2 group-hover:text-green-700 transition-colors">
                {service.title}
              </h3>
              <p className="text-green-700 text-sm leading-relaxed mb-4">{service.shortDesc}</p>

              {/* Features */}
              <ul className="space-y-1.5 mb-5">
                {service.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-green-600 font-medium">
                    <FaCheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA Link */}
              <div className="flex items-center gap-1.5 text-sm font-semibold text-green-700 group-hover:text-green-900 transition-colors">
                Learn more
                <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Accent bottom line */}
              <div
                className={`absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r ${service.color} rounded-b-2xl transition-all duration-500`}
              />
            </div>
          ))}
        </div>

        {/* View All Services CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => {
              analytics.ctaClick("View All Services", "homepage_services_section");
              navigate("/services");
            }}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <FaLeaf className="w-5 h-5" />
            View All Services
            <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
