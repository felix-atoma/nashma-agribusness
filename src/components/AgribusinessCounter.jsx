import React, { useEffect, useState, useRef } from "react";

const AgribusinessCounter = () => {
  const stats = [
    { number: 500, text: "Women Empowered" },
    { number: 300, text: "Youth Trained" },
    { number: 150, text: "Disabilities Supported" },
    { number: 1000, text: "Tons of Cocoa Waste Recycled" },
  ];

  return (
    <div className="text-center p-8 bg-white">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Stats</h2>
      <div className="flex flex-wrap justify-around items-center gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center flex-1 min-w-[200px]">
            <Counter target={stat.number} />
            <p className="text-gray-800 mt-2 text-lg">{stat.text}</p>
          </div>
        ))}
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
      { threshold: 0.5 } // Trigger when 50% of the counter is visible
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
    const duration = 2000; // Animation duration in ms
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // Clamp between 0 and 1
      const value = Math.floor(progress * target);

      setCount(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <h2 ref={counterRef} className="text-3xl font-bold text-green-600">
      {count}+
    </h2>
  );
};

export default AgribusinessCounter;
