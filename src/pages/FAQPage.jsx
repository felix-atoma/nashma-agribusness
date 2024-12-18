import React, { useState } from "react";

const FAQPage = () => {
  const faqs = [
    {
      question: "What is Nashma Agribusiness?",
      answer:
        "Nashma Agribusiness is a platform dedicated to empowering young people and women in agriculture through skills training, direct market access, and sustainable practices.",
    },
    {
      question: "What services does Nashma Agribusiness provide?",
      answer:
        "We offer training programs in sustainable agriculture, facilitate market access for farmers, and promote the use of eco-friendly agricultural practices.",
    },
    {
      question: "Who can participate in Nashma's programs?",
      answer:
        "Our programs are open to young people and women interested in agriculture and looking to enhance their skills and market opportunities.",
    },
    {
      question: "How can I sign up for training programs?",
      answer:
        "You can sign up by visiting our website, navigating to the 'Training Programs' section, and completing the registration form.",
    },
    {
      question: "Does Nashma Agribusiness sell agricultural products?",
      answer:
        "Yes, we facilitate the sale of potash and other agricultural products through our platform, connecting producers with buyers.",
    },
    {
      question: "How can I contact Nashma Agribusiness for more information?",
      answer:
        "You can contact us through the 'Contact Us' section on our website or reach out to us on our social media platforms."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-50 p-8">
      <h1 className="text-center text-3xl text-green-600 mb-8">Frequently Asked Questions</h1>
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white mb-4 rounded-lg shadow-md"
          >
            <div
              onClick={() => toggleFAQ(index)}
              className="p-4 cursor-pointer font-bold text-green-600 flex justify-between items-center"
            >
              {faq.question}
              <span>{activeIndex === index ? "-" : "+"}</span>
            </div>
            {activeIndex === index && (
              <div className="p-4 text-gray-700">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
