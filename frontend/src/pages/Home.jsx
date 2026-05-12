import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import ExperienceSection from "../components/ExperienceSection";
import AgribusinessCounter from "../components/AgribusinessCounter";
import WhyChooseUs from "../components/WhyChooseUs";
import ContactPage from "../components/ContactPage";
import Team from "../components/Team";
import ServicesSection from "../components/servicesSection";
import { FaArrowUp, FaLeaf, FaSeedling, FaRecycle, FaSpider, FaFlask } from "react-icons/fa";
import { analytics } from "../utils/analytics";

const slides = [
  {
    image: "/20241112_162930.jpg",
    title: "Organic Cocoa Potash — Made in Ghana",
    description:
      "Transforming cocoa waste into premium organic potash and authentic African Black Soap. Creating sustainable wealth for communities across Ghana.",
    icon: <FaRecycle className="text-4xl mb-4 text-amber-500" />,
    primaryCta: { text: "Shop Products", path: "/products" },
    secondaryCta: { text: "Contact Us", path: "/contact" },
  },
  {
    image: "/20241112_164309.jpg",
    title: "Women-Led Potash & Black Soap Training",
    description:
      "We train women and youth to produce organic potash — turning cocoa waste into lasting, dignified livelihoods. We also supply authentic African Black Soap.",
    icon: <FaSeedling className="text-4xl mb-4 text-green-400" />,
    primaryCta: { text: "Our Services", path: "/services" },
    secondaryCta: { text: "Learn More", path: "/about" },
  },
  {
    image: "/20241112_165510 (1).jpg",
    title: "Inclusive, Sustainable Agriculture",
    description:
      "Empowering women, youth, and persons with disabilities through accessible, dignified agricultural production across Ghana.",
    icon: <FaLeaf className="text-4xl mb-4 text-emerald-400" />,
    primaryCta: { text: "Our Mission", path: "/mission" },
    secondaryCta: { text: "Get in Touch", path: "/contact" },
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animated, setAnimated] = useState(false);
  const webRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for web animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (webRef.current) {
      observer.observe(webRef.current);
    }

    return () => {
      if (webRef.current) {
        observer.unobserve(webRef.current);
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const webNodes = [
    { title: "Organic Farming", icon: <FaLeaf />, position: "top-left", delay: "0" },
    { title: "Community Empowerment", icon: <FaSeedling />, position: "top-right", delay: "100" },
    { title: "Sustainable Practices", icon: <FaRecycle />, position: "right-middle", delay: "200" },
    { title: "Market Access", icon: <FaSpider />, position: "bottom-right", delay: "300" },
    { title: "Youth Training", icon: <FaSeedling />, position: "bottom-left", delay: "400" },
    { title: "Women Support", icon: <FaLeaf />, position: "left-middle", delay: "500" },
  ];

  const getNodePosition = (position) => {
    const positions = {
      'top-left': 'lg:top-10 lg:left-10',
      'top-right': 'lg:top-10 lg:right-10',
      'right-middle': 'lg:top-1/2 lg:right-10 lg:-translate-y-1/2',
      'bottom-right': 'lg:bottom-10 lg:right-10',
      'bottom-left': 'lg:bottom-10 lg:left-10',
      'left-middle': 'lg:top-1/2 lg:left-10 lg:-translate-y-1/2'
    };
    return positions[position] || '';
  };

  return (
    <div className="w-full bg-gradient-to-b from-green-50 to-amber-50 overflow-hidden">
      {/* 🌿 SEO Meta Tags */}
      <Helmet>
        <title>Nashma Agribusiness — Sustainable Cocoa Potash & Organic Farming in Ghana</title>
        <meta
          name="description"
          content="Nashma Agribusiness empowers Ghanaian farmers through eco-friendly cocoa potash, black soap, and sustainable agriculture initiatives. Transforming waste into wealth for a greener future."
        />
        <meta
          name="keywords"
          content="Nashma Agribusiness, cocoa potash, black soap, organic farming, sustainable agriculture, Ghana, agribusiness, Ashanti Region, eco farming, women and youth empowerment"
        />
        <meta property="og:title" content="Nashma Agribusiness — Organic Cocoa Potash & Black Soap" />
        <meta
          property="og:description"
          content="Explore Nashma Agribusiness: Ghana-based supplier of organic cocoa potash, black soap, and eco-friendly fertilizer solutions."
        />
        <meta property="og:image" content="/nashma-preview.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.nashmaagribusiness.com/" />
      </Helmet>

      {/* Animated Background Web */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Web Lines */}
        <div className="absolute inset-0 opacity-10">
          {/* Radial Web Lines */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <div
              key={angle}
              className="absolute top-1/2 left-1/2 w-0.5 h-96 bg-green-400 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                transformOrigin: 'center'
              }}
            />
          ))}
          
          {/* Concentric Circles */}
          {[1, 2, 3, 4].map((ring) => (
            <div
              key={ring}
              className="absolute top-1/2 left-1/2 border border-green-300 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{
                width: `${ring * 200}px`,
                height: `${ring * 200}px`,
                opacity: 0.2 - (ring * 0.05)
              }}
            />
          ))}
        </div>
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-amber-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Hero Carousel */}
      <div className="relative h-[80vh] sm:h-screen w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-10000"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-amber-900/40"></div>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4 sm:p-6 z-20">
              <div className="mb-6">
                {slide.icon}
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 max-w-4xl leading-tight">
                {slide.title}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl leading-relaxed text-green-100">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={() => {
                    analytics.ctaClick(slide.primaryCta.text, "hero_carousel");
                    navigate(slide.primaryCta.path);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/40"
                >
                  {slide.primaryCta.text}
                </button>
                <button
                  onClick={() => {
                    analytics.ctaClick(slide.secondaryCta.text, "hero_carousel");
                    navigate(slide.secondaryCta.path);
                  }}
                  className="border-2 border-white text-white hover:bg-white hover:text-green-800 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  {slide.secondaryCta.text}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "bg-amber-400 scale-125" 
                  : "bg-white/70 hover:bg-white"
              }`}
            ></button>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 hidden sm:block z-30">
          <div className="animate-bounce text-white">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Spider Web Network Section */}
      <div 
        ref={webRef}
        className="relative py-20 bg-gradient-to-b from-green-600/10 to-amber-600/10"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <FaSpider className="w-4 h-4" />
              Our Interconnected Network
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-900 mb-4">
              Weaving a <span className="text-amber-600">Sustainable Web</span> of Impact
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-lg text-green-700 max-w-2xl mx-auto leading-relaxed">
              Like a spider carefully crafting its web, we connect communities, resources, and opportunities 
              to create a strong, resilient agricultural ecosystem in Ghana.
            </p>
          </div>

          {/* Spider Web Visualization */}
          <div className="relative h-[600px] lg:h-[800px] flex items-center justify-center">
            {/* Central Hub */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-1000 ${
              animated ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}>
              <div className="bg-gradient-to-br from-green-600 to-amber-600 text-white rounded-full p-8 shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-500 w-48 h-48 flex items-center justify-center text-center">
                <div>
                  <FaSpider className="w-12 h-12 mx-auto mb-2" />
                  <h3 className="font-bold text-lg">Nashma Core</h3>
                  <p className="text-green-100 text-sm">Sustainable Agriculture Hub</p>
                </div>
              </div>
            </div>

            {/* Web Connection Lines */}
            <div className="absolute inset-0 pointer-events-none z-10">
              {webNodes.map((node, index) => (
                <div
                  key={index}
                  className={`absolute top-1/2 left-1/2 w-0.5 h-64 bg-gradient-to-b from-green-400 to-amber-400 opacity-30 transition-all duration-1000 ${
                    animated ? 'opacity-30 scale-100' : 'opacity-0 scale-0'
                  }`}
                  style={{
                    transform: `translate(-50%, -50%) rotate(${index * 60}deg)`,
                    transformOrigin: 'center bottom',
                    transitionDelay: `${index * 100}ms`
                  }}
                />
              ))}
            </div>

            {/* Web Nodes */}
            {webNodes.map((node, index) => (
              <div
                key={index}
                className={`absolute ${getNodePosition(node.position)} z-20 transition-all duration-1000 ${
                  animated ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
                style={{ transitionDelay: `${node.delay}ms` }}
              >
                <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-green-200 p-6 text-center max-w-[200px]">
                  {/* Connection Point */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-r from-green-400 to-amber-400 rounded-full border-2 border-white shadow-lg"></div>
                  
                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-amber-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    {node.icon}
                  </div>
                  
                  <h3 className="font-bold text-green-900 text-sm mb-2 group-hover:text-green-700 transition-colors">
                    {node.title}
                  </h3>
                  
                  <div className="w-6 h-0.5 bg-gradient-to-r from-green-400 to-amber-400 mx-auto mb-2"></div>
                  
                  <p className="text-xs text-green-600">
                    Connected through sustainable practices
                  </p>
                </div>
              </div>
            ))}

            {/* Floating Connection Dots */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-amber-400 rounded-full opacity-70 transition-all duration-1000 ${
                  animated ? 'opacity-70 scale-100' : 'opacity-0 scale-0'
                }`}
                style={{
                  left: `${50 + 40 * Math.cos((i * 30 * Math.PI) / 180)}%`,
                  top: `${50 + 40 * Math.sin((i * 30 * Math.PI) / 180)}%`,
                  transitionDelay: `${i * 80}ms`
                }}
              />
            ))}
          </div>

          {/* Web Description */}
          <div className="text-center mt-12 max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200 shadow-lg">
              <h3 className="text-2xl font-bold text-green-900 mb-4">The Strength of Our Web</h3>
              <p className="text-green-700 leading-relaxed">
                Our spider web model represents the interconnected nature of sustainable agriculture. 
                Each strand supports the others, creating a resilient network where communities, 
                resources, and knowledge flow freely. Just as a spider's web can withstand environmental 
                challenges, our agricultural network is built to thrive through collaboration and 
                mutual support.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agricultural Feature Strip */}
      <div className="bg-gradient-to-r from-green-600 to-amber-600 text-white py-6 px-4 relative overflow-hidden">
        {/* Web Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 30% 30%, transparent 0%, transparent 50%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.3) 100%)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <FaLeaf className="text-2xl text-green-200" />, text: "Organic Farming" },
              { icon: <FaRecycle className="text-2xl text-amber-200" />, text: "Sustainable Practices" },
              { icon: <FaSeedling className="text-2xl text-green-200" />, text: "Quality Products" },
              { icon: <FaSpider className="text-2xl text-amber-200" />, text: "Network Strength" }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-3">
                {item.icon}
                <span className="text-sm font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Overview — all 5 services */}
      <ServicesSection />

      {/* Main Content */}
      <div className="py-16 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Welcome Section */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-4">
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
                Welcome to Nashma Agribusiness
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
              Organic Potash, Black Soap &{" "}
              <span className="text-amber-600">Community Empowerment</span> in Ghana
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto mb-8"></div>
            <p className="text-lg text-green-800 leading-relaxed">
              At Nashma Agribusiness, we produce premium organic cocoa potash and authentic African
              Black Soap — while training women and youth to do the same. Our mission is to turn
              agricultural waste into lasting wealth for Ghanaian communities.
            </p>
          </div>

          <ExperienceSection />
          <AgribusinessCounter />
          <WhyChooseUs />
          <Team />
          <ContactPage />
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 bg-gradient-to-r from-green-600 to-amber-500 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 z-50 group"
      >
        <FaArrowUp className="text-xl sm:text-2xl transform group-hover:-translate-y-1 transition-transform" />
      </button>

      {/* Add custom animation for floating particles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;