import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaSeedling, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { toast } from "react-toastify";
import { analytics } from "../utils/analytics";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const apiBase = import.meta.env?.VITE_API_BASE_URL?.trim() || "https://nashma-backend-1-1.onrender.com/api";
      const res = await fetch(`${apiBase}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Thank you for subscribing to our agricultural updates!");
        analytics.newsletterSubscribe();
        setEmail("");
      } else {
        throw new Error(data.message || "Subscription failed.");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Our Products", href: "/products" },
    { name: "Services", href: "/services" },
    { name: "Mission & Vision", href: "/mission" },
    { name: "Our Team", href: "/team" },
    { name: "Contact", href: "/contact" }
  ];

  const socialLinks = [
    {
      href: "https://web.facebook.com/profile.php?id=61569281702237",
      icon: <FaFacebook className="w-5 h-5" />,
      name: "Facebook",
      color: "hover:bg-blue-600"
    },
    {
      href: "https://www.tiktok.com/@nasma_agribusines_ltd?_t=8s5LHKwrZ5B&_r=1",
      icon: <SiTiktok className="w-5 h-5" />,
      name: "TikTok",
      color: "hover:bg-black"
    },
    {
      href: "https://www.instagram.com/nashma_agribusiness/profilecard/?igsh=MWxna2NsYzhocHJqdQ==",
      icon: <FaInstagram className="w-5 h-5" />,
      name: "Instagram",
      color: "hover:bg-pink-600"
    }
  ];

  const contactInfo = [
    {
      icon: <FaPhone className="w-4 h-4" />,
      text: "(+233) 0545086577 / 0243241649",
      href: "tel:+2330545086577"
    },
    {
      icon: <FaEnvelope className="w-4 h-4" />,
      text: "info@nashmaagribusiness.com",
      href: "mailto:info@nashmaagribusiness.com"
    },
    {
      icon: <FaMapMarkerAlt className="w-4 h-4" />,
      text: "Apemso-KNUST, Kumasi, Ghana",
      href: "https://maps.google.com/?q=Apemso-KNUST,Kumasi"
    }
  ];

  return (
    <footer className="bg-gradient-to-b from-green-800 to-green-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500 rounded-lg">
                <FaSeedling className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Nashma Agribusiness Ltd.</h3>
                <p className="text-green-200 text-sm">Growing Sustainable Futures</p>
              </div>
            </div>
            <p className="text-green-200 mb-6 leading-relaxed">
              Transforming agriculture in Ghana through sustainable practices, 
              innovative solutions, and community empowerment since 2014.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  target={contact.href.includes('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-green-200 hover:text-amber-300 transition-colors duration-300 group"
                >
                  <div className="p-1 bg-green-700 rounded group-hover:bg-amber-500 transition-colors">
                    {contact.icon}
                  </div>
                  <span className="text-sm">{contact.text}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-amber-400">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-green-200 hover:text-amber-300 transition duration-300 py-2 text-sm hover:translate-x-1 transform"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-amber-400">Stay Updated</h3>
            <p className="text-green-200 mb-4 text-sm">
              Subscribe to our newsletter for the latest updates on sustainable agriculture, 
              new products, and community initiatives.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-green-700 border border-green-600 rounded-lg text-white placeholder-green-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Subscribing...
                  </div>
                ) : (
                  "Subscribe to Updates"
                )}
              </button>
            </form>
          </div>

          {/* Social Media */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-amber-400">Follow Our Growth</h3>
            <p className="text-green-200 mb-6 text-sm">
              Connect with us on social media to see our latest projects, 
              farming tips, and community impact stories.
            </p>
            
            <div className="flex gap-3 mb-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 bg-green-700 rounded-lg text-white ${social.color} transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Business Hours */}
            <div className="bg-green-700/50 rounded-lg p-4 border border-green-600">
              <h4 className="font-semibold text-amber-300 mb-2 text-sm">Business Hours</h4>
              <div className="text-green-200 text-sm space-y-1">
                <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-green-300 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Nashma Agribusiness Ltd. All Rights Reserved.
            </p>
            <div className="flex gap-6 text-green-300 text-sm">
              <a href="/privacy" className="hover:text-amber-300 transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-amber-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;