import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  FaSeedling,
  FaShippingFast,
  FaChalkboardTeacher,
  FaHandsHelping,
  FaRecycle,
  FaUsers,
  FaChartLine,
  FaArrowRight,
  FaLeaf
} from "react-icons/fa";

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animatedStats, setAnimatedStats] = useState(false);
  const [animatedContent, setAnimatedContent] = useState(false);
  const [animatedHero, setAnimatedHero] = useState(false);
  
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const contentRef = useRef(null);

  const impactStats = [
    { number: 20, label: "Women Empowered", icon: <FaUsers className="w-6 h-6" /> },
    { number: 10, label: "Youth Trained", icon: <FaChalkboardTeacher className="w-6 h-6" /> },
    { number: 2, label: "Disabilities Supported", icon: <FaHandsHelping className="w-6 h-6" /> },
    { number: 5, label: "Tons Waste Recycled", icon: <FaRecycle className="w-6 h-6" /> },
  ];

  const features = [
    {
      icon: <FaHandsHelping className="text-3xl" />,
      title: "Community Empowerment",
      description: "We empower women, young people, and individuals with disabilities to turn cocoa waste into wealth by converting cocoa pods into potash and connecting them with direct markets.",
      color: "from-blue-500 to-cyan-500",
      delay: "0"
    },
    {
      icon: <FaChalkboardTeacher className="text-3xl" />,
      title: "Training & Facilities",
      description: "We provide training and set up processing facilities, ensuring our beneficiaries can focus on production without the burden of searching for buyers.",
      color: "from-green-500 to-emerald-500",
      delay: "200"
    },
    {
      icon: <FaSeedling className="text-3xl" />,
      title: "Sustainable Production",
      description: "Potash produced by our communities is used in industries such as black soap production, water treatment, and food preservation.",
      color: "from-amber-500 to-orange-500",
      delay: "400"
    },
    {
      icon: <FaShippingFast className="text-3xl" />,
      title: "Market Access",
      description: "We handle logistics and ensure the processed potash reaches diverse industries, enabling sustainable income for our partners.",
      color: "from-purple-500 to-indigo-500",
      delay: "600"
    }
  ];

  // Intersection Observer using native JavaScript
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
          } else if (entry.target === statsRef.current) {
            setAnimatedStats(true);
          } else if (entry.target === contentRef.current) {
            setAnimatedContent(true);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (heroRef.current) observer.observe(heroRef.current);
    if (statsRef.current) observer.observe(statsRef.current);
    if (contentRef.current) observer.observe(contentRef.current);

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
      if (statsRef.current) observer.unobserve(statsRef.current);
      if (contentRef.current) observer.unobserve(contentRef.current);
    };
  }, []);

  // Auto-rotate stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % impactStats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Counter component with native intersection detection
  const Counter = ({ target, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const counterRef = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            let start = 0;
            const increment = target / (duration / 50);
            const timer = setInterval(() => {
              start += increment;
              if (start >= target) {
                setCount(target);
                clearInterval(timer);
              } else {
                setCount(Math.floor(start));
              }
            }, 50);
          }
        },
        { threshold: 0.5 }
      );

      if (counterRef.current) {
        observer.observe(counterRef.current);
      }

      return () => {
        if (counterRef.current) {
          observer.unobserve(counterRef.current);
        }
      };
    }, [target, duration, hasAnimated]);

    return (
      <span ref={counterRef} className="font-bold">
        {count.toLocaleString()}+
      </span>
    );
  };

  return (
    <div className="overflow-hidden bg-gradient-to-b from-green-50 to-amber-50">
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>About Nashma Agribusiness — Empowering Sustainable Cocoa Communities in Ghana</title>
        <meta
          name="description"
          content="Learn about Nashma Agribusiness, a Ghana-based social enterprise turning cocoa waste into organic potash and black soap. We empower women, youth, and persons with disabilities through sustainable agribusiness training and market access."
        />
        <meta
          name="keywords"
          content="Nashma Agribusiness, about Nashma, Ghana agribusiness, cocoa waste recycling, sustainable farming, organic potash, black soap, empowerment, Ashanti Region, social enterprise"
        />
        <meta name="author" content="Nashma Agribusiness" />
        <meta property="og:title" content="About Nashma Agribusiness — Sustainable Cocoa Innovation in Ghana" />
        <meta
          property="og:description"
          content="Nashma Agribusiness empowers Ghanaian communities to transform cocoa waste into organic potash and natural products, promoting sustainability and inclusion."
        />
        <meta property="og:image" content="/20241112_170250.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_GB" />
      </Helmet>

      {/* Animated Hero Section */}
      <div 
        ref={heroRef}
        className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-amber-900/60 z-10"></div>
        <img
          src="/20241112_170250.jpg"
          alt="NASHMA banner"
          className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-10000"
        />
        <div 
          className={`absolute inset-0 flex items-center justify-center text-white text-center z-20 px-4 transition-all duration-1000 ${
            animatedHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-green-300/30">
              <FaLeaf className="w-4 h-4" />
              Sustainable Agriculture
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Imagine a world where{" "}
              <span className="text-amber-300">waste becomes wealth</span>.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-green-100 max-w-2xl mx-auto leading-relaxed">
              Transforming cocoa waste into sustainable opportunities for Ghanaian communities
            </p>
            
            {/* Animated floating elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-amber-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-5 -right-5 w-16 h-16 bg-green-400 rounded-full opacity-30 animate-bounce"></div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* Animated Stats Section */}
      <div 
        ref={statsRef}
        className="py-16 bg-gradient-to-r from-green-600 to-amber-600 text-white"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 transition-all duration-1000 ${
            animatedStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact in Numbers</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Measuring success through lives transformed and sustainable impact created
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {impactStats.map((stat, index) => (
              <div
                key={index}
                className={`text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 transition-all duration-700 ${
                  animatedStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-amber-300 mb-2">
                  <Counter target={stat.number} />
                </div>
                <p className="text-green-100 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="py-20 px-4">
        <div 
          ref={contentRef}
          className="container mx-auto max-w-6xl"
        >
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Image with Animation */}
            <div className="w-full lg:w-1/2">
              <div className={`relative transition-all duration-1000 ${
                animatedContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <img
                    src="/20241128_150316.jpg"
                    alt="Nashma process of turning cocoa waste into potash"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent"></div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-6 -left-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-2xl p-6 z-10">
                  <FaRecycle className="w-8 h-8" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-2xl p-6 border border-green-100">
                  <div className="text-center">
                    <FaSeedling className="w-8 h-8 text-green-600 mb-2 mx-auto" />
                    <p className="text-2xl font-bold text-green-800">5+</p>
                    <p className="text-sm text-green-600 font-medium">Years Experience</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content with Staggered Animation */}
            <div className="w-full lg:w-1/2">
              <div className={`transition-all duration-1000 ${
                animatedContent ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}>
                {/* Header */}
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <FaChartLine className="w-4 h-4" />
                  Our Mission
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-6 leading-tight">
                  Empowering Communities Through{" "}
                  <span className="text-amber-600">Innovation</span>
                </h2>
                
                <div className="w-20 h-1 bg-amber-500 mb-8"></div>

                {/* Features Grid */}
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-6 p-4 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 border border-green-100 group hover:border-green-200 ${
                        animatedContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                      }`}
                      style={{ transitionDelay: `${feature.delay}ms` }}
                    >
                      <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-green-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-green-800 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Animated CTA Button */}
                <button
                  className="group mt-8 flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                  onClick={() => console.log("Navigating to more about us...")}
                >
                  <span>Read More About Us</span>
                  <FaArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl text-white mb-6 mx-auto">
                <FaLeaf className="w-8 h-8" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-green-900 mb-4">Our Vision</h3>
              <p className="text-green-800 text-lg leading-relaxed">
                A world where every cocoa farming community thrives through sustainable practices, 
                turning agricultural waste into economic opportunities that empower women, youth, 
                and persons with disabilities.
              </p>
            </div>

            {/* Mission */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white mb-6 mx-auto">
                <FaSeedling className="w-8 h-8" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-green-900 mb-4">Our Mission</h3>
              <p className="text-green-800 text-lg leading-relaxed">
                To transform cocoa waste into valuable products while creating sustainable 
                livelihoods through training, market access, and community empowerment 
                initiatives across Ghana.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;