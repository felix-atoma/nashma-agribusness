import React from "react";
import { Helmet } from "react-helmet-async";
import { MdEmail, MdWork } from "react-icons/md";

const Team = () => {
  const teamMembers = [
    {
      name: "Malik Sumaila Bipembi",
      role: "Manager",
      email: "malik@nashmafarms@gmail.com",
      image: "dist/Malik1.jpg", // located in public folder
    },
    {
      name: "Nadiatu Ali Dawud",
      role: "Relationship and Marketing Manager",
      email: "nadia@nashmafarms@gmail.com",
      image: "dist/Nadia.jpg",
    },
    {
      name: "Shita Hamidu",
      role: "Field and Training Manager",
      email: "shita@nashmafarms@gmail.com",
      image: "dist/Shita.jpg",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-green-50 to-white py-16 px-4">
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Meet Our Team
          </h1>
          <p className="text-lg text-green-700 max-w-2xl mx-auto">
            Dedicated professionals committed to excellence in agribusiness and sustainable farming practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
            >
              <div className="relative h-64 overflow-hidden bg-gray-200">
                <img
                  src={member.image}
                  alt={`${member.name} - ${member.role}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23059669' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='120' fill='white'%3E" +
                      member.name.charAt(0) +
                      "%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {member.name}
                </h3>

                <div className="flex items-start gap-2 text-green-600 mb-4">
                  <MdWork className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p className="font-semibold text-sm leading-relaxed">
                    {member.role}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <MdEmail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <a
                    href={`mailto:${member.email}`}
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors break-all"
                  >
                    {member.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-4">
              Join Our Team
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              At Nashma Agribusiness Ltd., we're always looking for passionate individuals who share our commitment to sustainable agriculture and innovation. If you're interested in joining our team, we'd love to hear from you.
            </p>
            <a
              href="/contact"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
