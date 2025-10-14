import React from "react";
import { FiPhone, FiMail, FiMapPin, FiMessageCircle } from "react-icons/fi";
import { FaWhatsapp, FaSeedling, FaLeaf } from "react-icons/fa";

const ContactPage = () => {
  const contactInfo = [
    {
      icon: <FiPhone className="w-6 h-6" />,
      label: "Phone",
      value: "(+233) 0545086577 / 0243241649",
      subValue: "Mon-Fri: 8:00 AM - 6:00 PM",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      href: "tel:+2330545086577"
    },
    {
      icon: <FiMail className="w-6 h-6" />,
      label: "Email",
      value: "nashmafarms@gmail.com",
      subValue: "We respond within 24 hours",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      href: "mailto:nashmafarms@gmail.com"
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      label: "Address",
      value: "Apemso-KNUST, Kumasi",
      subValue: "Ashanti Region, Ghana",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      href: "https://maps.google.com/?q=Apemso-KNUST,Kumasi"
    }
  ];

  return (
    <div className="relative py-16 md:py-24 px-4 bg-gradient-to-br from-green-50 via-white to-amber-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200 rounded-full -translate-x-36 -translate-y-36 opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full translate-x-48 translate-y-48 opacity-30"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Section - Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img
                  src="/1. Cocoa Potash Label 5Kg[1].jpg"
                  alt="Nashma Agribusiness Cocoa Potash Product"
                  className="w-full h-auto object-cover"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/10 to-transparent"></div>
              </div>
              
              {/* Floating Product Badge */}
              <div className="absolute -top-4 -left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-lg p-4">
                <div className="text-center">
                  <FaLeaf className="w-6 h-6 mb-1 mx-auto" />
                  <p className="text-sm font-semibold">Premium Quality</p>
                </div>
              </div>

              {/* Floating Certification */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-green-100">
                <div className="text-center">
                  <FaSeedling className="w-6 h-6 text-green-600 mb-1 mx-auto" />
                  <p className="text-xs font-semibold text-green-800">Organic Certified</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-xl shadow-lg border border-green-100">
                <p className="text-2xl font-bold text-green-700">10+</p>
                <p className="text-xs text-green-600">Years Experience</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-lg border border-amber-100">
                <p className="text-2xl font-bold text-amber-700">500+</p>
                <p className="text-xs text-amber-600">Happy Clients</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-lg border border-green-100">
                <p className="text-2xl font-bold text-green-700">100%</p>
                <p className="text-xs text-green-600">Organic</p>
              </div>
            </div>
          </div>

          {/* Right Section - Contact Information */}
          <div className="w-full lg:w-1/2">
            <div className="text-center lg:text-left">
              {/* Header */}
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <FiMessageCircle className="w-4 h-4" />
                Get In Touch
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
                Let's Grow <span className="text-amber-600">Together</span>
              </h2>
              
              <div className="w-20 h-1 bg-amber-500 mb-6 mx-auto lg:mx-0"></div>
              
              <p className="text-lg text-green-700 mb-8 leading-relaxed">
                Ready to transform your agricultural practices? Reach out to us for premium cocoa potash, 
                sustainable farming solutions, and partnership opportunities.
              </p>
            </div>

            {/* Contact Information Cards */}
            <div className="space-y-6 mb-8">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target={item.href.includes('http') ? '_blank' : '_self'}
                  rel={item.href.includes('http') ? 'noopener noreferrer' : ''}
                  className={`${item.bgColor} rounded-xl p-6 border border-transparent hover:border-green-200 transition-all duration-300 group hover:shadow-lg block`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} text-white group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 mb-1">{item.label}</h3>
                      <p className="text-green-800 font-medium">{item.value}</p>
                      <p className="text-sm text-green-600 mt-1">{item.subValue}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => (window.location.href = "/contact")}
                className="group flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex-1"
              >
                <FiMessageCircle className="w-5 h-5" />
                Drop Your Message
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <a
                href="https://wa.me/2330545086577"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <FaWhatsapp className="w-5 h-5" />
                WhatsApp
              </a>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-amber-800 text-sm text-center">
                <span className="font-semibold">Quick Response Guaranteed</span> - Our team typically responds within 2 hours during business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;