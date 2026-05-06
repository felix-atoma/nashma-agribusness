import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {
  FaPhoneAlt, FaSeedling, FaGlobe, FaGraduationCap, FaLeaf,
  FaArrowRight, FaRecycle, FaFlask, FaCheckCircle, FaStar
} from "react-icons/fa";
import { analytics } from "../utils/analytics";

const services = [
  {
    id: "potash-production",
    image: "/20241112_160941.jpg",
    title: "Cocoa Potash Production",
    tagline: "Organic. Powerful. 100% Natural.",
    description:
      "We produce premium organic potash from cocoa pods — turning agricultural waste into a high-value commodity used in black soap manufacturing, water treatment, food preservation, and organic fertiliser.",
    icon: <FaRecycle className="w-6 h-6" />,
    color: "from-green-500 to-emerald-600",
    badge: "Core Product",
    features: [
      "100% Organic Cocoa Potash",
      "Industrial-grade purity",
      "Multiple downstream applications",
      "Certified quality assurance",
    ],
  },
  {
    id: "african-black-soap",
    image: "/20241112_165130.jpg",
    title: "African Black Soap Production",
    tagline: "Traditional. Natural. Chemical-Free.",
    description:
      "We produce authentic African Black Soap using our own organic cocoa potash as the primary ingredient. Made using time-honoured traditional methods, our black soap is 100% natural, deeply nourishing, and free from harmful chemicals. Available for wholesale and retail.",
    icon: <FaFlask className="w-6 h-6" />,
    color: "from-amber-500 to-orange-600",
    badge: "New & Featured",
    isFeatured: true,
    features: [
      "100% natural ingredients",
      "Organic cocoa potash base",
      "Traditional recipe — no chemicals",
      "Wholesale & retail available",
    ],
  },
  {
    id: "skills-training",
    image: "/20241112_162930.jpg",
    title: "Women & Youth Skills Training",
    tagline: "Empowering Communities Through Knowledge.",
    description:
      "We train women, youth, and persons with disabilities in the full production chain — from cocoa potash extraction to African black soap making. We provide facilities, market linkages, and entrepreneurship coaching so trainees can build independent, sustainable livelihoods.",
    icon: <FaGraduationCap className="w-6 h-6" />,
    color: "from-rose-500 to-pink-600",
    badge: "Community Impact",
    features: [
      "Hands-on potash & soap training",
      "Processing facility access",
      "Market access guaranteed",
      "Entrepreneurship coaching",
    ],
  },
  {
    id: "global-bulk-supply",
    image: "/20241126_165239.jpg",
    title: "Global Bulk Supply",
    tagline: "From Ghana to the World.",
    description:
      "We handle the efficient global supply of bulk organic potash and agro-commodities, connecting Ghanaian producers directly with international buyers. Our logistics-first approach means farmers focus on quality production while we handle everything else.",
    icon: <FaGlobe className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-600",
    badge: "International",
    features: [
      "International bulk shipping",
      "Direct producer–buyer links",
      "Full logistics management",
      "Competitive pricing",
    ],
  },
  {
    id: "sustainable-farming-workshops",
    image: "/20241112_163334.jpg",
    title: "Sustainable Farming Workshops",
    tagline: "Modern Techniques. Better Yields.",
    description:
      "Our hands-on workshops teach modern, eco-friendly farming techniques — soil conservation, organic inputs, crop rotation, and integrating cocoa potash into farm management — to improve productivity while protecting Ghana's environment.",
    icon: <FaLeaf className="w-6 h-6" />,
    color: "from-teal-500 to-green-600",
    badge: "Education",
    features: [
      "Organic farming methods",
      "Soil health & conservation",
      "Crop rotation planning",
      "Potash integration techniques",
    ],
  },
];

const Services = () => {
  const navigate = useNavigate();
  const [animatedServices, setAnimatedServices] = useState(false);
  const [animatedHero, setAnimatedHero] = useState(false);
  const servicesRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === heroRef.current) setAnimatedHero(true);
            if (entry.target === servicesRef.current) setAnimatedServices(true);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    if (servicesRef.current) observer.observe(servicesRef.current);
    return () => observer.disconnect();
  }, []);

  const handleInquiry = (serviceTitle) => {
    analytics.serviceInquiry(serviceTitle);
    navigate("/contact");
  };

  const featuredService = services.find((s) => s.isFeatured);
  const regularServices = services.filter((s) => !s.isFeatured);

  return (
    <div className="bg-gradient-to-b from-green-50 to-amber-50 min-h-screen">
      <Helmet>
        <title>Our Services — Nashma Agribusiness | Cocoa Potash, Black Soap & Training in Ghana</title>
        <meta
          name="description"
          content="Nashma Agribusiness offers cocoa potash production, African black soap manufacturing, women's skills training, global bulk supply, and sustainable farming workshops across Ghana."
        />
        <meta
          name="keywords"
          content="Nashma Agribusiness services, cocoa potash production Ghana, African black soap Ghana, black soap manufacturing, women potash training, sustainable farming, global potash supply, agribusiness Ghana"
        />
        <link rel="canonical" href="https://www.nashmaagribusiness.com/services" />
        <meta property="og:title" content="Our Services — Nashma Agribusiness | Cocoa Potash & Black Soap" />
        <meta
          property="og:description"
          content="Cocoa potash production, African black soap, women's skills training, global bulk supply, and sustainable farming workshops in Ghana."
        />
        <meta property="og:url" content="https://www.nashmaagribusiness.com/services" />
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        className={`relative pt-32 pb-20 px-4 text-center transition-all duration-1000 ${
          animatedHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <FaSeedling className="w-4 h-4" />
          What We Do
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 mb-6 leading-tight max-w-4xl mx-auto">
          Five Ways We Create{" "}
          <span className="text-amber-600">Sustainable Value</span>
        </h1>
        <div className="w-24 h-1 bg-amber-500 mx-auto mb-6" />
        <p className="text-lg md:text-xl text-green-700 max-w-3xl mx-auto leading-relaxed">
          From producing organic cocoa potash and authentic African Black Soap to training
          women and youth — every service we offer turns waste into wealth and
          creates lasting community impact across Ghana.
        </p>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
          {[
            { icon: <FaStar className="text-amber-500" />, text: "10+ Years Experience" },
            { icon: <FaCheckCircle className="text-green-500" />, text: "500+ Women Trained" },
            { icon: <FaCheckCircle className="text-green-500" />, text: "1,000+ Tons Processed" },
            { icon: <FaCheckCircle className="text-green-500" />, text: "5 Core Services" },
          ].map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-green-100 rounded-full px-4 py-2 text-sm text-green-800 font-semibold shadow-sm"
            >
              {badge.icon}
              {badge.text}
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured: African Black Soap ────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <img
            src={featuredService.image}
            alt={featuredService.title}
            className="w-full h-72 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/85 via-amber-800/70 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8 md:px-16">
            <div className="max-w-xl text-white">
              <div className="inline-flex items-center gap-2 bg-amber-500/30 border border-amber-300/40 backdrop-blur-sm text-amber-200 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <FaStar className="w-3 h-3" />
                {featuredService.badge}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
                {featuredService.title}
              </h2>
              <p className="text-amber-200 font-semibold mb-3">{featuredService.tagline}</p>
              <p className="text-white/90 leading-relaxed mb-6 max-w-lg text-sm md:text-base">
                {featuredService.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {featuredService.features.map((f, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full"
                  >
                    <FaCheckCircle className="w-3 h-3 text-amber-300" />
                    {f}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleInquiry(featuredService.title)}
                className="group inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-amber-500/40"
              >
                <FaPhoneAlt className="w-4 h-4" />
                Inquire About Black Soap
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── All 4 remaining services ─────────────────────────────────────── */}
      <div ref={servicesRef} className="max-w-6xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-3">
            All Our Services
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {regularServices.map((service, index) => (
            <div
              key={service.id}
              className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-green-100 ${
                animatedServices
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 left-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${service.color} text-white shadow-lg`}
                  >
                    {service.icon}
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                    {service.badge}
                  </span>
                </div>
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${service.color}`} />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-900 mb-1 group-hover:text-green-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-amber-600 text-sm font-semibold mb-3">{service.tagline}</p>
                <p className="text-green-700 leading-relaxed mb-5 text-sm">{service.description}</p>

                {/* Features */}
                <ul className="grid grid-cols-2 gap-1.5 mb-6">
                  {service.features.map((feature, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-sm text-green-600">
                      <FaCheckCircle className={`w-3.5 h-3.5 flex-shrink-0 bg-gradient-to-r ${service.color} bg-clip-text text-transparent`} style={{}} />
                      <FaCheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleInquiry(service.title)}
                  className={`group/btn w-full flex items-center justify-center gap-3 bg-gradient-to-r ${service.color} text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5`}
                >
                  <FaPhoneAlt className="w-4 h-4" />
                  Get This Service
                  <FaArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
        <div
          className={`mt-16 text-center transition-all duration-1000 delay-500 ${
            animatedServices ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-3xl p-10 text-white shadow-2xl max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 border border-white rounded-full"
                  style={{
                    width: `${(i + 1) * 120}px`,
                    height: `${(i + 1) * 120}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <FaLeaf className="w-4 h-4" />
                Start Today
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Work With Us?
              </h2>
              <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
                Whether you want to buy cocoa potash, order African Black Soap, join a training
                programme, or arrange bulk supply — we're ready to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    analytics.ctaClick("Contact Us", "services_bottom_cta");
                    navigate("/contact");
                  }}
                  className="group flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                >
                  <FaPhoneAlt className="w-5 h-5" />
                  Contact Us Now
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    analytics.ctaClick("View Products", "services_bottom_cta");
                    navigate("/products");
                  }}
                  className="flex items-center justify-center gap-3 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-800 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <FaSeedling className="w-5 h-5" />
                  View Products
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10 max-w-4xl mx-auto">
          {[
            { number: "10+", label: "Years Experience" },
            { number: "500+", label: "Women Trained" },
            { number: "1,000+", label: "Tons Processed" },
            { number: "5", label: "Core Services" },
            { number: "100%", label: "Organic" },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-4 bg-white rounded-xl shadow border border-green-100 hover:shadow-md transition"
            >
              <p className="text-2xl font-bold text-green-700">{stat.number}</p>
              <p className="text-xs text-green-600 font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
