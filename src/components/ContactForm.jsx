import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaHome, FaPhone, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import apiClient from "../utils/apiClient";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error("Invalid email format.");
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

  return (
    <div className="w-full mx-auto p-4 md:p-8">
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

      {/* Banner */}
      <div className="relative w-full mb-6">
        <img
          src="/IMG-20250307-WA0027.jpg"
          alt="Contact Nashma Agribusiness Office in Kumasi"
          className="w-full h-auto md:h-[400px] object-cover"
        />
      </div>

      <h2 className="text-2xl md:text-3xl mb-6 text-gray-800 text-center md:text-left">
        Get in Touch
      </h2>

      <div className="flex flex-col md:flex-row gap-6 md:gap-12">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 w-full">
          {[
            { field: "name", type: "text", placeholder: "Enter your name" },
            { field: "email", type: "email", placeholder: "Enter your email" },
            { field: "phone", type: "text", placeholder: "Enter your phone (optional)" },
            { field: "subject", type: "text", placeholder: "Enter your subject" },
          ].map(({ field, type, placeholder }) => (
            <input
              key={field}
              type={type}
              name={field}
              placeholder={placeholder}
              value={formData[field]}
              onChange={handleChange}
              className="p-3 border border-green-600 text-base w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required={field !== "phone"}
            />
          ))}

          <textarea
            name="message"
            placeholder="Enter your message"
            value={formData.message}
            onChange={handleChange}
            className="p-3 border border-green-600 text-base w-full resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows="5"
            required
          />

          <button
            type="submit"
            className={`p-3 border-2 border-green-600 bg-white text-green-600 font-bold text-lg w-full md:w-[200px] mt-4 transition-all duration-200 ${
              isSending
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-green-600 hover:text-white"
            }`}
            disabled={isSending}
          >
            {isSending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </span>
            ) : (
              "Send Message"
            )}
          </button>
        </form>

        {/* Contact Info */}
        <div className="flex-1 flex flex-col gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <FaHome size={24} className="text-green-600" />
            <div>
              <p className="font-bold m-0">Kumasi, Ghana</p>
              <p className="m-0">Apemso-KNUST, Kumasi</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <FaPhone size={24} className="text-green-600" />
            <div>
              <p className="m-0">0545086577 / 0243241649</p>
              <p className="m-0">Mon to Fri 9am to 5pm</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <FaEnvelope size={24} className="text-green-600" />
            <div>
              <p className="m-0">nashmafarms@gmail.com</p>
              <p className="m-0">Reach out anytime!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
