import { useState } from "react";
import { FaHome, FaPhone, FaEnvelope } from "react-icons/fa";
import emailjs from "emailjs-com";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setStatusMessage({ text: "Invalid email format.", type: "error" });
      return;
    }

    setIsSending(true);
    setStatusMessage({ text: "", type: "" });

    const emailData = {
      to_name: "Nashma Admin",
      from_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      await emailjs.send(
        "service_qvw1nee", 
        "template_nck1umh",
        emailData,
        "QKLwxjX-pqOTBiWsv"
      );

      setStatusMessage({ text: "Your message has been sent successfully!", type: "success" });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      setStatusMessage({ text: "An error occurred. Please try again later.", type: "error" });
      console.error("EmailJS error:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full mx-auto p-4 md:p-8">
      {/* Image */}
      <div className="relative w-full mb-6">
        <img
          src="/20241112_164309.jpg"
          alt="Contact"
          className="w-full h-auto md:h-[400px] object-cover"
        />
      </div>

      {/* Heading */}
      <h2 className="text-2xl md:text-3xl mb-6 text-gray-800 text-center md:text-left">
        Get in Touch
      </h2>

      <div className="flex flex-col md:flex-row gap-6 md:gap-12">
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 w-full">
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 border border-green-600 text-base w-full"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 border border-green-600 text-base w-full"
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            className="p-3 border border-green-600 text-base w-full"
            required
          />

          <input
            type="text"
            name="subject"
            placeholder="Enter subject"
            value={formData.subject}
            onChange={handleChange}
            className="p-3 border border-green-600 text-base w-full"
            required
          />

          {/* Message Field (Last Input Before Submit) */}
          <textarea
            name="message"
            placeholder="Enter your message"
            value={formData.message}
            onChange={handleChange}
            className="p-3 border border-green-600 text-base w-full resize-none"
            rows="5"
            required
          />

          {statusMessage.text && (
            <p className={`mt-2 text-sm text-center ${statusMessage.type === "success" ? "text-green-600" : "text-red-600"}`} aria-live="polite">
              {statusMessage.text}
            </p>
          )}

          <button
            type="submit"
            className={`p-3 border-2 border-green-600 bg-white text-green-600 font-bold text-lg w-full md:w-[200px] mt-4 ${
              isSending ? "cursor-not-allowed opacity-50" : "hover:bg-green-600 hover:text-white transition-all"
            }`}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </form>

        {/* Contact Info Section */}
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
              <p className="m-0">0545086577</p>
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
