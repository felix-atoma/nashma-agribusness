import { useState } from "react";
import { FaHome, FaPhone, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import apiClient from "../utils/apiClient"

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
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
      // Use the correct method from apiClient
      const response = await apiClient.sendContactMessage(formData);
      
      console.log("Contact form response:", response);
      
      toast.success(response.data?.message || "Your message has been sent successfully!");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

    } catch (error) {
      console.error("Contact form submission error:", error);
      
      // Handle different error scenarios
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
      <div className="relative w-full mb-6">
        <img
          src="/IMG-20250307-WA0027.jpg"
          alt="Contact"
          className="w-full h-auto md:h-[400px] object-cover"
        />
      </div>

      <h2 className="text-2xl md:text-3xl mb-6 text-gray-800 text-center md:text-left">
        Get in Touch
      </h2>

      <div className="flex flex-col md:flex-row gap-6 md:gap-12">
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col gap-4 w-full"
        >
          {[
            { field: "name", type: "text", placeholder: "Enter your name" },
            { field: "email", type: "email", placeholder: "Enter your email" },
            { field: "phone", type: "text", placeholder: "Enter your phone (optional)" },
            { field: "subject", type: "text", placeholder: "Enter your subject" }
          ].map(({ field, type, placeholder }) => (
            <input
              key={field}
              type={type}
              name={field}
              placeholder={placeholder}
              value={formData[field]}
              onChange={handleChange}
              className="p-3 border border-green-600 text-base w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required={field !== "phone"} // Phone is optional
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