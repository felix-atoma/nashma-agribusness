import { useState } from "react";
import { FaHome, FaPhone, FaEnvelope } from "react-icons/fa";
import emailjs from "emailjs-com";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    message: "",
    name: "",
    email: "",
    phone: "",
    subject: "",
  });

  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

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
        "service_qvw1nee", // Replace with your EmailJS Service ID
        "template_nck1umh", // Replace with your EmailJS Template ID
        emailData, // Mapped data
        "QKLwxjX-pqOTBiWsv" // Replace with your EmailJS Public Key
      );
      alert("Your message has been sent!");
      setFormData({ message: "", name: "", email: "", phone: "", subject: "" });
    } catch (error) {
      alert("An error occurred. Please try again later.");
      console.error("EmailJS error:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full mx-auto p-8 box-border">
      <div className="relative w-full mb-8">
        <img
          src="/20241112_164309.jpg"
          alt="Contact"
          className="w-full h-screen object-cover"
        />
      </div>
      <h2 className="text-2xl mb-8 text-gray-800 text-left">Get in Touch</h2>
      <div className="flex flex-wrap gap-8 items-start">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col gap-6 w-full max-w-lg"
        >
          <textarea
            name="message"
            placeholder="Enter your message"
            value={formData.message}
            onChange={handleChange}
            className="p-4 border border-green-600 resize-none text-base w-full"
            rows="6"
            required
          />
          <div className="flex flex-wrap gap-4 w-full">
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="flex-1 p-4 border border-green-600 text-base min-w-[200px]"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="flex-1 p-4 border border-green-600 text-base min-w-[200px]"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="flex-1 p-4 border border-green-600 text-base min-w-[200px]"
              required
            />
          </div>
          <input
            type="text"
            name="subject"
            placeholder="Enter subject"
            value={formData.subject}
            onChange={handleChange}
            className="p-4 border border-green-600 text-base w-full"
            required
          />
          <button
            type="submit"
            className={`p-4 border-2 border-green-600 bg-white text-green-600 font-bold text-lg w-[150px] mt-4 ${
              isSending ? "cursor-not-allowed" : "hover:bg-green-600 hover:text-white transition-all"
            }`}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </form>
        {/* Contact Info */}
        <div className="flex-1 flex flex-col gap-12">
          <div className="flex items-center gap-4">
            <FaHome size={28} className="text-green-600" />
            <div>
              <p className="font-bold m-0">Kumasi, Ghana</p>
              <p className="m-0">Apemso-KNUST, Kumasi</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FaPhone size={28} className="text-green-600" />
            <div>
              <p className="m-0">0545086577</p>
              <p className="m-0">Mon to Fri 9am to 6pm</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FaEnvelope size={28} className="text-green-600" />
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
