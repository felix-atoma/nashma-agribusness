import React, { useState } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    setStatus("");
    setLoading(true);

    if (!email.includes("@")) {
      setStatus("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    const apiBase = import.meta.env?.VITE_API_BASE_URL;
    if (!apiBase) {
      setStatus("API base URL is not set.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("Thank you for subscribing!");
        setEmail("");
      } else {
        const data = await res.json();
        throw new Error(data.message || "Subscription failed.");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setStatus("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-green-50 text-green-600 py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:justify-between md:items-start gap-6">
        {/* Logo */}
        <div className="text-xl font-bold">Nashma Agribusiness Ltd.</div>

        {/* Quick Links */}
        <div className="flex flex-col md:items-start">
          {["About", "Services", "Contact"].map((link, idx) => (
            <a
              key={idx}
              href={`/${link.toLowerCase().replace(/\s+/g, "")}`}
              className="text-green-600 hover:text-green-800 transition duration-300 text-base"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Newsletter */}
        <div className="flex flex-col w-full md:w-[300px]">
          <h3 className="font-semibold mb-2">Subscribe to our Newsletter</h3>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border border-green-600 rounded-md w-full"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
              disabled={loading}
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          {status && (
            <p className="mt-2 text-sm text-green-700">{status}</p>
          )}
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center gap-4 mt-4 md:mt-0">
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
  &copy; {new Date().getFullYear()} Nashma Agribusiness Ltd. All Rights Reserved.
</p>

    </footer>
  );
};

export default Footer;
