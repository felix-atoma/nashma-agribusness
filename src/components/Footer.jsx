import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { SiTiktok } from "react-icons/si"; // TikTok icon

const Footer = () => {
  return (
    <footer className="bg-green-50 text-green-600 py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:justify-between md:items-start gap-6">
        {/* Logo */}
        <div className="text-xl font-bold">Nashma Agribusiness Ltd.</div>

        {/* Quick Links */}
        <div className="flex flex-col md:items-start">
          {["About", "Services", "Contact", "FAQ"].map((link, idx) => (
            <a
              key={idx}
              href={`/${link.toLowerCase().replace(/\s+/g, "")}`}
              className="text-green-600 hover:text-green-800 transition duration-300 text-base"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center gap-4">
          {[
            {
              href: "https://web.facebook.com/profile.php?id=61569281702237",
              icon: <FaFacebook />,
            },
            {
              href: "https://www.tiktok.com/@nasma_agribusines_ltd?_t=8s5LHKwrZ5B&_r=1",
              icon: <SiTiktok />,
            },
            {
              href: "https://www.instagram.com/nashma_agribusiness/profilecard/?igsh=MWxna2NsYzhocHJqdQ==",
              icon: <FaInstagram />,
            },
          ].map((social, idx) => (
            <a
              key={idx}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800 text-xl transition duration-300"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <p className="text-center text-sm mt-6">
        &copy; 2024 Nashma Agribusiness Ltd. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
