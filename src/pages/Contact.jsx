import React from "react";
import { Helmet } from "react-helmet-async";
import ContactForm from "../components/ContactForm";

const Contact = () => {
  return (
    <div className="p-6 md:p-4 contact-container">
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>Contact Nashma Agribusiness — Get in Touch with Us</title>
        <meta
          name="description"
          content="Reach out to Nashma Agribusiness for inquiries about organic cocoa potash, black soap, and natural fertilizers. Based in Kumasi, Ghana, we’re happy to assist with wholesale and partnership requests."
        />
        <meta
          name="keywords"
          content="Nashma Agribusiness contact, Ghana agribusiness, cocoa potash supplier, black soap wholesale, organic fertilizer, Ashanti Region agriculture, Kumasi business"
        />
        <meta name="author" content="Nashma Agribusiness" />
        <link rel="canonical" href="https://www.nashmaagribusiness.com/contact" />
        <meta property="og:title" content="Contact Nashma Agribusiness" />
        <meta
          property="og:description"
          content="Get in touch with Nashma Agribusiness — your trusted Ghanaian supplier of organic cocoa potash and black soap."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.nashmaagribusiness.com/contact" />
        <meta property="og:image" content="/nashma-removebg-preview.png" />
      </Helmet>

      {/* Page Content */}
      <h2 className="text-2xl font-bold mb-4 md:text-lg">Contact Us</h2>
      <ContactForm />
    </div>
  );
};

export default Contact;
