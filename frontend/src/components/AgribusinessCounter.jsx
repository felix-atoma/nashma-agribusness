import React, { useEffect, useState, useRef } from "react";
import { FaUsers, FaGraduationCap, FaWheelchair, FaRecycle, FaSeedling, FaChartLine } from "react-icons/fa";

const AgribusinessCounter = () => {
  const stats = [
    {
      number: 5,
      text: "Farmers Served",
      icon: <FaSeedling className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      number: 20,
      text: "Women Empowered",
      icon: <FaUsers className="w-6 h-6" />,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      textColor: "text-pink-700"
    },
    {
      number: 10,
      text: "Youth Trained",
      icon: <FaGraduationCap className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      number: 2,
      text: "Persons with Disability Supported",
      icon: <FaWheelchair className="w-6 h-6" />,
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    },
    {
      number: 5,
      text: "Tonnes of Cocoa Waste Recycled",
      icon: <FaRecycle className="w-6 h-6" />,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700"
    },
  ];

  return (
    <div className="relative py-16 md:py-24 px-4 bg-gradient-to-br from-green-50 via-white to-amber-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200 rounded-full -translate-x-36 -translate-y-36 opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full translate-x-48 translate-y-48 opacity-30"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <FaChartLine className="w-4 h-4" />
            Our Impact in Numbers
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
            Growing <span className="text-amber-600">Communities</span>
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
          <p className="text-lg text-green-700 max-w-2xl mx-auto leading-relaxed">
            Measuring our success through the lives we've transformed and the sustainable impact we've created in Ghana's agricultural sector.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="relative group"
            >
              <div className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100 ${stat.bgColor}`}>
                {/* Animated gradient bar */}
                <div className={`h-2 bg-gradient-to-r ${stat.color} group-hover:animate-pulse`}></div>
                
                <div className="p-6 md:p-8 text-center">
                  {/* Icon Container */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {stat.icon}
                  </div>

                  {/* Counter */}
                  <div className="mb-4">
                    <Counter target={stat.number} />
                  </div>

                  {/* Text */}
                  <p className={`text-lg font-semibold ${stat.textColor} leading-tight`}>
                    {stat.text}
                  </p>
                </div>

                {/* Hover effect border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-white rounded-2xl transition-all duration-300 pointer-events-none"></div>
              </div>

              {/* Floating particles effect */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-amber-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 animation-delay-300"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-green-700 bg-green-100 px-6 py-3 rounded-full">
            <FaSeedling className="w-5 h-5 text-green-600" />
            <span className="font-semibold">Creating sustainable impact since 2014</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Counter = ({ target }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          startCounting();
        }
      },
      { threshold: 0.3 } // Trigger when 30% of the counter is visible
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [hasAnimated]);

  const startCounting = () => {
    const duration = 2500; // Slightly longer for dramatic effect
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(easeOut * target);

      setCount(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div ref={counterRef} className="flex items-baseline justify-center gap-1">
      <span className="text-4xl md:text-5xl font-bold text-green-900 tracking-tight">
        {count.toLocaleString()}
      </span>
      <span className="text-2xl md:text-3xl font-bold text-amber-600">+</span>
    </div>
  );
};

export default AgribusinessCounter;