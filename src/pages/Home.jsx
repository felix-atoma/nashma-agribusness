import React, { useState, useEffect } from "react";
import ExperienceSection from "../components/ExperienceSection";
import AgribusinessCounter from "../components/AgribusinessCounter";
import WhyChooseUs from "../components/WhyChooseUs";
import ContactPage from "../components/ContactPage";
import { FaArrowUp } from "react-icons/fa";

const slides = [
  {
    image: "/20241112_162930.jpg",
    title: "Empowering Sustainable Agriculture",
    description: "Transforming waste into wealth through innovation and collaboration.",
  },
  {
    image: "/20241112_164309.jpg",
    title: "Opportunities for Women and Youth",
    description: "Advancing eco-friendly farming and creating inclusive opportunities for growth.",
  },
  {
    image: "/20241112_165510 (1).jpg",
    title: "Inclusive Agriculture",
    description: "Empowering persons with disabilities through accessible farming solutions.",
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Clean up interval
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full">
      {/* Hero Carousel */}
      <div className="relative h-screen w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 text-white p-5">
              <h1 className="text-4xl font-bold mb-4">{slide.title}</h1>
              <p className="text-lg">{slide.description}</p>
            </div>
          </div>
        ))}

        {/* Carousel Dots */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-gray-300"
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 py-10">
        <ExperienceSection />
        <AgribusinessCounter />
        <WhyChooseUs />
        <ContactPage />
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 bg-green-600 text-white rounded-full p-4 shadow-md transition hover:bg-green-700 z-50"
      >
        <FaArrowUp className="text-2xl" />
      </button>
    </div>
  );
};

export default Home;
