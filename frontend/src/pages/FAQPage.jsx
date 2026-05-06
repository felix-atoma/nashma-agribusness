import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaQuestionCircle, FaTimes } from "react-icons/fa";

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
        "You can contact us through the 'Contact Us' section on our website or reach out to us on our social media platforms.",
    },
    {
      question: "How do I use the Add to Cart feature?",
      answer:
        "You can add any product to your cart by clicking the 'Add to Cart' button on the product listing. You can view your cart anytime using the cart icon at the top or bottom of the screen, and proceed to place your order directly through our platform.",
    },
    {
      question: "What is African Black Soap and how does Nashma make it?",
      answer:
        "African Black Soap is a natural, chemical-free soap made using traditional West African methods. At Nashma Agribusiness, we use our own organic cocoa potash as the primary ingredient, combined with natural oils and plant extracts. The result is a 100% natural soap that cleanses, nourishes, and is safe for all skin types — made right here in Kumasi, Ghana.",
    },
    {
      question: "Can I buy African Black Soap from Nashma Agribusiness?",
      answer:
        "Yes! We sell authentic African Black Soap in both retail and wholesale quantities. You can browse and order through our Products page, or contact us directly for bulk orders and wholesale pricing.",
    },
    {
      question: "Do you offer training in African Black Soap making?",
      answer:
        "Absolutely. Our skills training programme teaches women and youth the complete process — from cocoa potash extraction to African Black Soap production. We provide hands-on training, facility access, and direct market linkages so trainees can build independent livelihoods. Contact us to enrol in the next training cohort.",
    },
    {
      question: "What is cocoa potash used for beyond soap making?",
      answer:
        "Cocoa potash (also called lye or potassium carbonate from cocoa pods) has many industrial and agricultural uses: it is the key ingredient in African Black Soap, used in water treatment, food preservation, glass making, and as an organic potassium fertiliser that improves soil fertility for crop farming.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);
  const [showFAQ, setShowFAQ] = useState(false);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // FAQ structured data — powers Google's Q&A featured snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };

  return (
    <>
      {/* ── SEO ── */}
      <Helmet>
        <title>FAQ — Nashma Agribusiness | Cocoa Potash & Women's Training Questions</title>
        <meta
          name="description"
          content="Frequently asked questions about Nashma Agribusiness — Ghana's organic cocoa potash supplier. Learn about our women's potash training programs, how to buy potash, and our sustainable farming services."
        />
        <meta
          name="keywords"
          content="Nashma Agribusiness FAQ, cocoa potash questions, potash training Ghana, women agribusiness training FAQ, buy potash Ghana, sustainable farming questions"
        />
        <link rel="canonical" href="https://www.nashmaagribusiness.com/faq" />
        <meta property="og:title" content="FAQ — Nashma Agribusiness | Cocoa Potash & Women's Training" />
        <meta
          property="og:description"
          content="Answers to common questions about Nashma Agribusiness, our cocoa potash products, and women's potash making training programs in Ghana."
        />
        <meta property="og:url" content="https://www.nashmaagribusiness.com/faq" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Floating Support Icon with Tooltip */}
      <div className="fixed bottom-6 left-4 z-50 group">
        <button
          onClick={() => setShowFAQ((prev) => !prev)}
          className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition relative"
        >
          <FaQuestionCircle size={24} />
        </button>
        {/* Tooltip */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
          Need Help?
        </div>
      </div>

      {/* Chat-style FAQ Panel */}
      <div
        className={`fixed bottom-6 left-4 w-[90%] md:w-[400px] bg-white shadow-2xl rounded-lg overflow-y-auto max-h-[70vh] z-40 transition-transform duration-300 ${
          showFAQ ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex justify-between items-center px-4 pt-4 pb-2 border-b bg-green-50">
          <h2 className="text-lg font-bold text-green-700">Need Help? 👩🏽‍🌾</h2>
          <button onClick={() => setShowFAQ(false)} className="text-green-600 hover:text-red-500">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b pb-2">
              <div
                onClick={() => toggleFAQ(index)}
                className="cursor-pointer font-semibold text-green-700 flex justify-between"
              >
                {faq.question}
                <span>{activeIndex === index ? "-" : "+"}</span>
              </div>
              {activeIndex === index && (
                <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQPage;
