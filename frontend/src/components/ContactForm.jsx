import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { FaHome, FaPhone, FaEnvelope, FaSeedling, FaLeaf, FaArrowRight, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { toast } from "react-toastify";
import apiClient from "../utils/apiClient";
import { analytics } from "../utils/analytics";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [animated, setAnimated] = useState(false);
  const formRef = useRef(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
        }
      },
      { threshold: 0.2 }
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => {
      if (formRef.current) {
        observer.unobserve(formRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Message is required.");
      return;
    }

    setIsSending(true);

    try {
      const response = await apiClient.sendContactMessage(formData);
      toast.success(response.data?.message || "Your message has been sent successfully!");
      analytics.contactFormSubmit(formData.subject);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      console.error("Contact form submission error:", error);
      if (error.status === 400) {
        toast.error(error.data?.message || "Please check your input and try again.");
      } else if (error.status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (error.code === "ECONNABORTED") {
        toast.error("Request timeout. Please check your connection and try again.");
      } else {
        toast.error(error.data?.message || "An error occurred. Please try again later.");
      }
    } finally {
      setIsSending(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="w-6 h-6" />,
      title: "Our Location",
      details: ["Apemso-KNUST, Kumasi", "Ashanti Region, Ghana"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <FaPhone className="w-6 h-6" />,
      title: "Phone Numbers",
      details: ["0545086577", "0243241649"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaEnvelope className="w-6 h-6" />,
      title: "Email Address",
      details: ["info@nashmaagribusiness.com", "Reach out anytime!"],
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <FaClock className="w-6 h-6" />,
      title: "Business Hours",
      details: ["Monday - Friday: 8:00 AM - 6:00 PM", "Saturday: 9:00 AM - 2:00 PM"],
      color: "from-purple-500 to-indigo-500"
    }
  ];

  return (
    <div className="w-full mx-auto p-4 md:p-8 bg-gradient-to-br from-green-50 to-amber-50">
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>Contact Us — Nashma Agribusiness | Get in Touch for Potash & Sustainable Products</title>
        <meta
          name="description"
          content="Contact Nashma Agribusiness in Kumasi, Ghana. Get in touch to inquire about organic cocoa potash, African black soap, bulk supply, and sustainable farming initiatives."
        />
        <meta
          name="keywords"
          content="contact Nashma Agribusiness, cocoa potash Ghana, black soap supplier, organic fertilizer, sustainable agriculture, Ashanti Region, Nashma contact, Kumasi agribusiness"
        />
        <meta name="author" content="Nashma Agribusiness" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph for social sharing */}
        <meta property="og:title" content="Contact Nashma Agribusiness — Sustainable Cocoa Potash & Black Soap" />
        <meta
          property="og:description"
          content="Reach out to Nashma Agribusiness in Ghana for organic potash, sustainable cocoa farming, and eco-friendly product partnerships."
        />
        <meta property="og:image" content="/IMG-20250307-WA0027.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_GB" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Nashma Agribusiness | Organic Potash & Black Soap Supply" />
        <meta
          name="twitter:description"
          content="Get in touch with Nashma Agribusiness — your trusted source for sustainable potash and black soap production in Ghana."
        />
        <meta name="twitter:image" content="/IMG-20250307-WA0027.jpg" />
      </Helmet>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200 rounded-full -translate-x-36 -translate-y-36 opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full translate-x-48 translate-y-48 opacity-30"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <FaSeedling className="w-4 h-4" />
            Get In Touch
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 mb-4">
            Let's Grow <span className="text-amber-600">Together</span>
          </h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-green-700 max-w-2xl mx-auto leading-relaxed">
            Ready to transform your agricultural practices? Reach out to us for premium cocoa potash, 
            sustainable farming solutions, and partnership opportunities.
          </p>
        </div>

        {/* Banner */}
        <div className="relative w-full mb-12 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="/IMG-20250307-WA0027.jpg"
            alt="Nashma Agribusiness Office in Kumasi"
            className="w-full h-auto md:h-[400px] object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/40 to-amber-900/20"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaLeaf className="w-4 h-4" />
              <span className="font-semibold">Nashma Agribusiness Headquarters</span>
            </div>
          </div>
        </div>

        <div 
          ref={formRef}
          className="flex flex-col lg:flex-row gap-8 lg:gap-12"
        >
          {/* Contact Form */}
          <div className={`flex-1 transition-all duration-1000 ${
            animated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-green-100">
              <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaEnvelope className="w-6 h-6 text-green-600" />
                </div>
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { field: "name", type: "text", placeholder: "Enter your full name" },
                  { field: "email", type: "email", placeholder: "Enter your email address" },
                  { field: "phone", type: "text", placeholder: "Enter your phone number (optional)" },
                  { field: "subject", type: "text", placeholder: "Enter message subject" },
                ].map(({ field, type, placeholder }, index) => (
                  <div 
                    key={field}
                    className={`transition-all duration-700 ${
                      animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <input
                      type={type}
                      name={field}
                      placeholder={placeholder}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full p-4 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-green-50/50 hover:bg-green-50 text-green-900 placeholder-green-400"
                      required={field !== "phone"}
                    />
                  </div>
                ))}

                <div className={`transition-all duration-700 ${
                  animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`} style={{ transitionDelay: '400ms' }}>
                  <textarea
                    name="message"
                    placeholder="Tell us about your project or inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-4 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-green-50/50 hover:bg-green-50 text-green-900 placeholder-green-400 resize-none"
                    rows="6"
                    required
                  />
                </div>

                <div className={`transition-all duration-700 ${
                  animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`} style={{ transitionDelay: '500ms' }}>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="group w-full md:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <FaArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className={`flex-1 transition-all duration-1000 ${
            animated ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-green-100 h-full">
              <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaPhone className="w-6 h-6 text-green-600" />
                </div>
                Contact Information
              </h2>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div 
                    key={index}
                    className={`flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-amber-50 border border-green-100 hover:border-green-200 transition-all duration-300 group hover:shadow-lg ${
                      animated ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                    style={{ transitionDelay: `${index * 150 + 600}ms` }}
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${info.color} text-white group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 text-lg mb-2">
                        {info.title}
                      </h3>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-green-700 leading-relaxed">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Response Guarantee */}
              <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <FaLeaf className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-800">Quick Response Guaranteed</p>
                    <p className="text-amber-700 text-sm">We typically respond within 2 hours during business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map & Location Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
          {/* Header */}
          <div className="px-6 md:px-8 pt-8 pb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-1 text-center">
              Find Us on the Map
            </h2>
            <p className="text-center text-green-600 text-sm">Apemso-KNUST, Kumasi, Ashanti Region, Ghana</p>
          </div>

          {/* Info strip */}
          <div className="px-6 md:px-8 pb-6 grid sm:grid-cols-3 gap-4">
            {[
              { icon: <FaMapMarkerAlt className="w-5 h-5 text-green-600" />, label: "Address", value: "Apemso-KNUST, Kumasi" },
              { icon: <FaPhone className="w-5 h-5 text-green-600" />, label: "Phone", value: "(+233) 0545086577" },
              { icon: <FaClock className="w-5 h-5 text-green-600" />, label: "Hours", value: "Mon–Fri 8 AM – 6 PM" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">{item.icon}</div>
                <div>
                  <p className="text-xs font-bold text-green-500 uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm font-semibold text-green-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Embedded Google Map — Apemso-KNUST, Kumasi */}
          <div className="w-full h-80 md:h-96">
            <iframe
              title="Nashma Agribusiness Location — Apemso-KNUST, Kumasi, Ghana"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.5!2d-1.5948!3d6.6714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdb96b44f38d0e7%3A0x9c5a0e1ba3e5b8cd!2sKNUST%2C%20Kumasi%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1700000000000!5m2!1sen!2sgh"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Directions CTA */}
          <div className="px-6 md:px-8 py-5 bg-green-50 border-t border-green-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-green-700 text-sm font-medium">
              Near KNUST — Kwame Nkrumah University of Science and Technology, Kumasi
            </p>
            <a
              href="https://www.google.com/maps/search/Apemso+KNUST+Kumasi+Ghana"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 shadow hover:shadow-lg whitespace-nowrap"
            >
              <FaMapMarkerAlt className="w-4 h-4" />
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;