import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  FaSeedling,
  FaHandsHelping,
  FaBullhorn,
  FaHandshake,
  FaShoppingCart,
  FaGlobeAfrica,
  FaLeaf,
  FaChartLine,
  FaUsers,
  FaRecycle,
  FaArrowRight
} from "react-icons/fa";

const Mission = () => {
  const [animatedCards, setAnimatedCards] = useState(false);
  const [animatedHero, setAnimatedHero] = useState(false);
  const missionRef = useRef(null);
  const heroRef = useRef(null);

  const missionCards = [
    {
      title: "Empowering Youth",
      content: "Provide young people with skills and opportunities to thrive in sustainable agriculture.",
      icon: <FaSeedling className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      features: ["Skills Training", "Career Opportunities", "Leadership Development", "Innovation Support"],
      position: "top-left",
      angle: "-45deg"
    },
    {
      title: "Empowering Women",
      content: "Support women in agriculture with training and market access for economic independence.",
      icon: <FaHandsHelping className="w-8 h-8" />,
      color: "from-pink-500 to-rose-500",
      features: ["Economic Empowerment", "Market Access", "Training Programs", "Community Leadership"],
      position: "top-right",
      angle: "45deg"
    },
    {
      title: "Awareness & Education",
      content: "Create brand visibility and educate about sustainable agricultural practices.",
      icon: <FaBullhorn className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      features: ["Public Awareness", "Training Workshops", "Knowledge Sharing", "Best Practices"],
      position: "right-middle",
      angle: "90deg"
    },
    {
      title: "Community Engagement",
      content: "Build trust by providing valuable content and fostering connections.",
      icon: <FaHandshake className="w-8 h-8" />,
      color: "from-amber-500 to-orange-500",
      features: ["Trust Building", "Community Partnerships", "Stakeholder Engagement", "Local Collaboration"],
      position: "bottom-right",
      angle: "135deg"
    },
    {
      title: "Market Access",
      content: "Facilitate direct market access to drive inquiries and increase sales.",
      icon: <FaShoppingCart className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-500",
      features: ["Direct Sales", "Supply Chain", "Market Linkages", "Business Development"],
      position: "bottom-left",
      angle: "225deg"
    },
    {
      title: "Global Impact",
      content: "Promote sustainable agricultural practices worldwide for a better future.",
      icon: <FaGlobeAfrica className="w-8 h-8" />,
      color: "from-teal-500 to-cyan-500",
      features: ["Sustainable Practices", "Global Outreach", "Environmental Impact", "International Standards"],
      position: "left-middle",
      angle: "270deg"
    },
  ];

  // Intersection Observers for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === heroRef.current) {
            setAnimatedHero(true);
          } else if (entry.target === missionRef.current) {
            setAnimatedCards(true);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (heroRef.current) observer.observe(heroRef.current);
    if (missionRef.current) observer.observe(missionRef.current);

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
      if (missionRef.current) observer.unobserve(missionRef.current);
    };
  }, []);

  const getCardPosition = (position) => {
    const positions = {
      'top-left': 'lg:top-0 lg:left-0 lg:-translate-x-20 lg:-translate-y-20',
      'top-right': 'lg:top-0 lg:right-0 lg:translate-x-20 lg:-translate-y-20',
      'right-middle': 'lg:top-1/2 lg:right-0 lg:translate-x-20 lg:-translate-y-1/2',
      'bottom-right': 'lg:bottom-0 lg:right-0 lg:translate-x-20 lg:translate-y-20',
      'bottom-left': 'lg:bottom-0 lg:left-0 lg:-translate-x-20 lg:translate-y-20',
      'left-middle': 'lg:top-1/2 lg:left-0 lg:-translate-x-20 lg:-translate-y-1/2'
    };
    return positions[position] || '';
  };

  return (
    <div className="bg-gradient-to-br from-green-50 via-amber-50 to-white min-h-screen pt-20 overflow-hidden">
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>Our Mission — Nashma Agribusiness | Empowering Sustainable Agriculture in Ghana</title>
        <meta
          name="description"
          content="Discover Nashma Agribusiness's mission to empower youth, women, and communities through sustainable agriculture, market access, and global impact initiatives in Ghana."
        />
        <meta
          name="keywords"
          content="Nashma Agribusiness mission, sustainable agriculture Ghana, youth empowerment, women in agriculture, community development, agricultural training, Ghana farming"
        />
        <meta name="author" content="Nashma Agribusiness" />
        <meta property="og:title" content="Our Mission — Nashma Agribusiness | Sustainable Agriculture Empowerment" />
        <meta
          property="og:description"
          content="Learn how Nashma Agribusiness is transforming communities through sustainable agriculture, empowerment programs, and market access initiatives in Ghana."
        />
        <meta property="og:image" content="/20241112_162930.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_GB" />
      </Helmet>

      {/* Animated Background Web */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Web Lines */}
        <div className="absolute inset-0 opacity-10">
          {/* Radial Web Lines */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <div
              key={angle}
              className="absolute top-1/2 left-1/2 w-1 h-96 bg-green-400 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                transformOrigin: 'center'
              }}
            />
          ))}
          
          {/* Concentric Circles */}
          {[1, 2, 3].map((ring) => (
            <div
              key={ring}
              className="absolute top-1/2 left-1/2 border-2 border-green-300 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{
                width: `${ring * 300}px`,
                height: `${ring * 300}px`,
                opacity: 0.3 - (ring * 0.1)
              }}
            />
          ))}
        </div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-amber-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div 
          ref={heroRef}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <div className={`transition-all duration-1000 ${
            animatedHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <FaLeaf className="w-4 h-4" />
              Our Guiding Mission
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 mb-6 leading-tight">
              Weaving a Web of{" "}
              <span className="text-amber-600">Sustainable</span> Impact
            </h1>
            
            <div className="w-24 h-1 bg-amber-500 mx-auto mb-8"></div>
            
            <p className="text-lg md:text-xl text-green-700 leading-relaxed mb-8 max-w-3xl mx-auto">
              Like a spider carefully crafting its web, we connect communities, resources, and opportunities 
              to create a strong, interconnected network of sustainable agriculture in Ghana.
            </p>

            {/* Mission Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mt-12">
              {[
                { number: "500+", label: "Youth Empowered" },
                { number: "300+", label: "Women Supported" },
                { number: "50+", label: "Communities Reached" },
                { number: "1000+", label: "Lives Impacted" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <p className="text-2xl md:text-3xl font-bold text-green-700 mb-2">{stat.number}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spider Web Mission Layout */}
        <div 
          ref={missionRef}
          className="relative min-h-[800px] lg:min-h-[1000px] flex items-center justify-center my-20"
        >
          {/* Central Core Mission */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-1000 ${
            animatedCards ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}>
            <div className="bg-gradient-to-br from-green-600 to-amber-600 text-white rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-500 max-w-md mx-auto text-center">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaLeaf className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Core Mission</h2>
              <p className="text-green-100 leading-relaxed">
                Transforming agriculture through interconnected initiatives that empower communities 
                and create sustainable livelihoods across Ghana.
              </p>
            </div>
          </div>

          {/* Web Connection Lines */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {missionCards.map((card, index) => (
              <div
                key={index}
                className={`absolute top-1/2 left-1/2 w-1 h-48 bg-gradient-to-b ${card.color.split(' ')[1]} opacity-30 transition-all duration-1000 ${
                  animatedCards ? 'opacity-30 scale-100' : 'opacity-0 scale-0'
                }`}
                style={{
                  transform: `translate(-50%, -50%) rotate(${card.angle})`,
                  transformOrigin: 'center bottom',
                  transitionDelay: `${index * 100}ms`
                }}
              />
            ))}
          </div>

          {/* Mission Cards positioned around the web */}
          {missionCards.map((card, index) => (
            <div
              key={index}
              className={`absolute ${getCardPosition(card.position)} z-20 transition-all duration-1000 ${
                animatedCards ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}
              style={{ transitionDelay: `${index * 150 + 300}ms` }}
            >
              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-green-200 max-w-xs">
                {/* Connection Point */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-green-400 to-amber-400 rounded-full border-2 border-white shadow-lg"></div>
                
                {/* Header with Gradient */}
                <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
                
                <div className="p-6">
                  {/* Icon Container */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${card.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {card.icon}
                    </div>
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-xs">{index + 1}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h2 className="text-lg md:text-xl font-bold text-green-900 mb-3 group-hover:text-green-700 transition-colors">
                    {card.title}
                  </h2>
                  
                  <p className="text-green-700 text-sm leading-relaxed mb-4">
                    {card.content}
                  </p>

                  {/* Features List */}
                  <div className="space-y-1 mb-4">
                    {card.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${card.color}`}></div>
                        <span className="text-xs text-green-600 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Learn More Button */}
                  <button className="group/btn w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-xl font-semibold hover:bg-green-100 transition-all duration-300 transform hover:-translate-y-0.5 border border-green-200 text-sm">
                    <span>Explore</span>
                    <FaArrowRight className="w-3 h-3 transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-300 rounded-2xl transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className={`text-center mt-32 transition-all duration-1000 ${
          animatedCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-gradient-to-r from-green-600 to-amber-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl max-w-4xl mx-auto relative overflow-hidden">
            {/* Web Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 20% 80%, transparent 0%, transparent 50%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.3) 100%)`,
                backgroundSize: '50px 50px'
              }}></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <FaChartLine className="w-4 h-4" />
                Join Our Network
              </div>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Become Part of Our Web
              </h2>
              
              <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Connect with our growing network of partners, farmers, and communities working together 
                to create sustainable agricultural solutions across Ghana.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group flex items-center justify-center gap-3 bg-white text-green-700 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl z-20">
                  <FaUsers className="w-5 h-5" />
                  <span>Join Network</span>
                  <FaArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="group flex items-center justify-center gap-3 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-700 transition-all duration-300 transform hover:-translate-y-1 z-20">
                  <FaRecycle className="w-5 h-5" />
                  <span>Explore Impact</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vision Statement */}
        <div className="mt-20 text-center max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-green-100 relative overflow-hidden">
            {/* Web Corner Accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-green-300 opacity-50"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-green-300 opacity-50"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-green-300 opacity-50"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-green-300 opacity-50"></div>
            
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <FaGlobeAfrica className="w-4 h-4" />
              Our Vision
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-green-900 mb-6">
              An Interconnected Sustainable Future
            </h3>
            
            <p className="text-lg text-green-700 leading-relaxed">
              We envision a world where communities are interconnected like a spider's web - strong, resilient, 
              and working in harmony. Where every strand supports the whole, creating a sustainable agricultural 
              ecosystem that benefits all participants in the value chain across Ghana and beyond.
            </p>
          </div>
        </div>
      </div>

      {/* Add custom animation for floating particles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Mission;