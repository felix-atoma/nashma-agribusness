import { useState } from "react";
import { FaHome, FaPhone, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";


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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateEmail(formData.email)) {
    toast.error("Invalid email format.");
    return;
  }

  setIsSending(true);

  const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/contact`;

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success("Your message has been sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } else {
      const data = await res.json();
      throw new Error(data.message || "Submission failed.");
    }
  } catch (error) {
    console.error("Submission error:", error);
    toast.error("An error occurred. Please try again later.");
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
          {["name", "email", "phone", "subject"].map((field) => (
            <input
              key={field}
              type={field === "email" ? "email" : "text"}
              name={field}
              placeholder={`Enter your ${field}`}
              value={formData[field]}
              onChange={handleChange}
              className="p-3 border border-green-600 text-base w-full"
              required
            />
          ))}

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
            <p
              className={`mt-2 text-sm text-center ${
                statusMessage.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {statusMessage.text}
            </p>
          )}

          <button
            type="submit"
            className={`p-3 border-2 border-green-600 bg-white text-green-600 font-bold text-lg w-full md:w-[200px] mt-4 ${
              isSending
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-green-600 hover:text-white transition-all"
            }`}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send"}
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
