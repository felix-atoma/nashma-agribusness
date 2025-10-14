import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt, FaSeedling, FaGlobe, FaGraduationCap, FaLeaf, FaArrowRight, FaRecycle } from "react-icons/fa";

const Services = () => {
  const navigate = useNavigate();
  const [animatedServices, setAnimatedServices] = useState(false);
  const servicesRef = useRef(null);

  const services = [
    {
      id: "potash-production",
      image: "/20241112_160941.jpg",
      title: "Potash Production",
      description: "We specialize in producing high-quality potash from cocoa pods, turning waste into wealth. Potash is used in various applications including black soap production, water treatment, and food preservation.",
      icon: <FaRecycle className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      features: ["Organic Cocoa Potash", "Waste Transformation", "Multiple Applications", "Quality Assurance"]
    },
    {
      id: "global-bulk-supply",
      image: "/20241126_165239.jpg",
      title: "Global Bulk Supply",
      description: "We ensure the efficient global supply of bulk products, including potash, to meet diverse market needs. Our goal is to provide a direct market for producers without the hassle of searching for buyers.",
      icon: <FaGlobe className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      features: ["International Shipping", "Bulk Order Handling", "Market Access", "Logistics Management"]
    },
    {
      id: "skills-training",
      image: "/20241112_162930.jpg",
      title: "Skills Training in Potash and African Black Soap",
      description: "Empowering communities with skills to produce potash and African black soap, fostering sustainable livelihoods and ensuring they can turn waste into wealth.",
      icon: <FaGraduationCap className="w-6 h-6" />,
      color: "from-amber-500 to-orange-500",
      features: ["Hands-on Training", "Traditional Techniques", "Modern Methods", "Entrepreneurship Skills"]
    },
    {
      id: "sustainable-farming-workshops",
      image: "/20241112_163334.jpg",
      title: "Sustainable Farming Workshops",
      description: "Teaching modern and sustainable farming techniques to enhance productivity while protecting the environment. We aim to integrate these practices with potash innovation.",
      icon: <FaLeaf className="w-6 h-6" />,
      color: "from-purple-500 to-indigo-500",
      features: ["Organic Farming", "Soil Conservation", "Crop Rotation", "Environmental Protection"]
    },
  ];

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimatedServices(true);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    );

    if (servicesRef.current) {
      observer.observe(servicesRef.current);
    }

    return () => {
      if (servicesRef.current) {
        observer.unobserve(servicesRef.current);
      }
    };
  }, []);

  const handleButtonClick = (id) => {
    navigate(`/contact`);
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-amber-50 min-h-screen">
      {/* ✅ SEO Tags */}
      <Helmet>
        <title>Our Services — Nashma Agribusiness | Sustainable Potash, Bulk Supply & Training</title>
        <meta
          name="description"
          content="Explore Nashma Agribusiness services: organic potash production, global bulk supply, skills training in African black soap, and sustainable farming workshops. Empowering communities across Ghana."
        />
        <meta
          name="keywords"
          content="Nashma Agribusiness services, potash production Ghana, organic potash, black soap training, global bulk supply, sustainable farming, cocoa waste recycling, agribusiness empowerment"
        />
        <meta name="author" content="Nashma Agribusiness" />
        <meta property="og:title" content="Our Services — Nashma Agribusiness | Sustainable Potash & Global Supply" />
        <meta
          property="og:description"
          content="Discover how Nashma Agribusiness transforms cocoa waste into wealth through potash production, black soap training, and sustainable farming workshops."
        />
        <meta property="og:image" content="/20241112_160941.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_GB" />
      </Helmet>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200 rounded-full -translate-x-36 -translate-y-36 opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full translate-x-48 translate-y-48 opacity-30"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <FaSeedling className="w-4 h-4" />
            Our Agricultural Services
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 mb-6 leading-tight">
            Empowering Sustainable{" "}
            <span className="text-amber-600">Solutions</span>
          </h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-green-700 max-w-3xl mx-auto leading-relaxed">
            Transforming cocoa waste into valuable opportunities through innovative services 
            that empower communities and promote sustainable agriculture across Ghana.
          </p>
        </div>

        {/* Services Grid */}
        <div 
          ref={servicesRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-green-100 ${
                animatedServices ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Image Section with Overlay */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent"></div>
                
                {/* Service Icon Badge */}
                <div className="absolute top-4 left-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${service.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                </div>

                {/* Gradient Accent */}
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${service.color}`}></div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-bold text-green-900 mb-3 group-hover:text-green-700 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-green-700 leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color}`}></div>
                        <span className="text-sm text-green-600 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleButtonClick(service.id)}
                  className="group/btn w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  <FaPhoneAlt className="w-4 h-4" />
                  <span>Get This Service</span>
                  <FaArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-200 rounded-2xl transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className={`text-center mt-16 transition-all duration-1000 ${
          animatedServices ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-gradient-to-r from-green-600 to-amber-600 rounded-2xl p-8 text-white shadow-2xl max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Agricultural Practices?
            </h2>
            <p className="text-green-100 mb-6 text-lg leading-relaxed">
              Join hundreds of farmers and entrepreneurs who have already benefited from our sustainable solutions. 
              Let's work together to create a greener, more prosperous future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/contact')}
                className="group flex items-center justify-center gap-3 bg-white text-green-700 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                <FaPhoneAlt className="w-5 h-5" />
                <span>Start Your Journey</span>
                <FaArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/about')}
                className="group flex items-center justify-center gap-3 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-700 transition-all duration-300 transform hover:-translate-y-1"
              >
                <FaSeedling className="w-5 h-5" />
                <span>Learn More</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          {[
            { number: "10+", label: "Years Experience" },
            { number: "500+", label: "Farmers Trained" },
            { number: "1000+", label: "Tons Processed" },
            { number: "4", label: "Core Services" }
          ].map((stat, index) => (
            <div 
              key={index}
              className="text-center p-4 bg-white rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <p className="text-2xl md:text-3xl font-bold text-green-700 mb-2">{stat.number}</p>
              <p className="text-sm text-green-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;