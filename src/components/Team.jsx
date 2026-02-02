import React from "react";
import { Helmet } from "react-helmet-async";
import { MdEmail, MdWork, MdLocationOn } from "react-icons/md";

const Team = () => {
  const teamMembers = [
    {
      name: "Malik Sumaila Bipembi",
      role: "Manager",
      email: "malik@ashmaagribusiness.com",
      image: "/malik.jpg",
    },
    {
      name: "Nadiatu Ali Dawud",
      role: "Relationship and Marketing Manager",
      email: "nadia@ashmaagribusiness.com",
      image: "/nadia.jpg",
    },
    {
      name: "Shita Hamidu",
      role: "Field and Training Manager",
      email: "shita@ashmaagribusiness.com",
      image: "/shitu.jpg",
    },
  ];

  // Agricultural color palette
  const colors = {
    primary: {
      darkGreen: "#1B5E20",     // Deep forest green
      mediumGreen: "#2E7D32",   // Healthy leaf green
      lightGreen: "#4CAF50",    // Fresh growth green
      earthBrown: "#5D4037",    // Rich soil brown
      golden: "#FFB300",        // Harvest gold
      cream: "#FFF8E1",         // Light cream background
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-green-50 to-amber-50 py-16 px-4">
      <Helmet>
        <title>Our Team — Nashma Agribusiness Leadership | Meet Our Expert Team</title>
        <meta
          name="description"
          content="Meet the dedicated team behind Nashma Agribusiness Ltd. Our experienced managers lead sustainable agriculture initiatives in Ghana, specializing in cocoa potash and organic farming."
        />
        <meta
          name="keywords"
          content="Nashma Agribusiness team, agriculture experts Ghana, farm management, agribusiness leadership, cocoa potash specialists, sustainable farming team"
        />
        <meta property="og:title" content="Meet Our Team — Nashma Agribusiness" />
        <meta
          property="og:description"
          content="Discover the expert team driving innovation in sustainable agriculture at Nashma Agribusiness Ltd."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
              Our Experts
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
            Meet Our <span className="text-amber-600">Team</span>
          </h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
          <p className="text-lg text-green-800 max-w-2xl mx-auto leading-relaxed">
            Dedicated professionals committed to excellence in agribusiness and sustainable farming practices.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden border border-green-100"
            >
              {/* Background accent */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-600 to-amber-500"></div>
              
              {/* Image Container */}
              <div className="relative h-72 overflow-hidden bg-gradient-to-br from-green-50 to-amber-50">
                <img
                  src={member.image}
                  alt={`${member.name} - ${member.role}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%232E7D32' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='120' fill='white'%3E" +
                      member.name.charAt(0) +
                      "%3C/text%3E%3C/svg%3E";
                  }}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-900 mb-3 group-hover:text-green-700 transition-colors">
                  {member.name}
                </h3>

                {/* Role with icon */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <MdWork className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800 text-sm">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Email with icon */}
                <div className="flex items-center gap-3 pt-4 border-t border-green-100">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MdEmail className="w-4 h-4 text-green-600" />
                  </div>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-sm text-green-700 hover:text-amber-600 transition-colors break-all font-medium"
                  >
                    {member.email}
                  </a>
                </div>
              </div>

              {/* Hover effect border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-300 rounded-xl transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16">
          <div className="relative bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-2xl p-8 text-center max-w-4xl mx-auto overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Grow With Us
              </h2>
              <p className="text-green-100 mb-6 leading-relaxed max-w-2xl mx-auto">
                At Nashma Agribusiness Ltd., we're always looking for passionate individuals who share our commitment to sustainable agriculture and innovation. If you're interested in joining our team, we'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Join Our Team
                </a>
                <a
                  href="/careers"
                  className="inline-flex items-center justify-center bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all duration-300 border border-green-200"
                >
                  View Openings
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-green-700">3+</div>
            <div className="text-sm text-green-600">Expert Managers</div>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-amber-600">50+</div>
            <div className="text-sm text-amber-600">Years Combined</div>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-green-700">100%</div>
            <div className="text-sm text-green-600">Dedicated</div>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-amber-600">24/7</div>
            <div className="text-sm text-amber-600">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;