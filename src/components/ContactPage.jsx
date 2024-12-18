import React from "react";

const ContactPage = () => {
  return (
    <div className="bg-white p-8 md:p-16">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto gap-8">
        {/* Left Section - Image */}
        <div className="w-full md:w-1/2">
          <img
            src="/1. Cocoa Potash Label 5Kg[1].jpg" // Replace with your actual image path
            alt="Agriculture"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Right Section - Contact Information */}
        <div className="w-full md:w-1/2 text-left">
          <h2 className="text-2xl font-semibold text-gray-800">Contact Us</h2>
          <p className="mt-4 text-lg text-gray-700">
            Get in touch with us for any inquiries or assistance.
          </p>
          <div className="mt-6 space-y-4">
            <p>
              <span className="font-semibold text-gray-800">Phone:</span>{" "}
              (+233) 0545086577 / 0243241649
            </p>
            <p>
              <span className="font-semibold text-gray-800">Email:</span>{" "}
              <a
                href="mailto:nashmafarms@gmail.com"
                className="text-blue-600 underline"
              >
                nashmafarms@gmail.com
              </a>
            </p>
            <p>
              <span className="font-semibold text-gray-800">Address:</span> Apemso-KNUST, Kumasi
            </p>
          </div>
          <div className="mt-8">
            <button
              onClick={() => (window.location.href = "/contact")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Drop Your Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
