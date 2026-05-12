import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle, Leaf, ArrowRight, Phone, Mail, Sparkles } from 'lucide-react';
import { FaFlask, FaStar, FaHeart } from 'react-icons/fa';

const benefits = [
  { icon: '✨', title: 'Deep Cleansing', desc: 'Naturally removes dirt, excess oil and impurities without stripping the skin.' },
  { icon: '🌿', title: 'Soothes Eczema & Acne', desc: 'Anti-inflammatory properties help calm irritated skin and reduce breakouts.' },
  { icon: '💧', title: 'Natural Moisturising', desc: 'Shea butter content keeps skin soft and hydrated after every wash.' },
  { icon: '🌍', title: '100% Natural Ingredients', desc: 'No parabens, no synthetic fragrances — only traditional West African ingredients.' },
];

const ingredients = [
  { name: 'Cocoa Potash', role: 'Natural alkali and cleanser', color: 'bg-amber-100 text-amber-800' },
  { name: 'Shea Butter', role: 'Moisturising & nourishing base', color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Plantain Ash', role: 'Gentle exfoliant and clarifier', color: 'bg-green-100 text-green-800' },
  { name: 'Palm Oil', role: 'Lather and conditioning agent', color: 'bg-orange-100 text-orange-800' },
  { name: 'Coconut Oil', role: 'Antibacterial and skin softener', color: 'bg-teal-100 text-teal-800' },
];

const steps = [
  { step: '01', title: 'Prepare the Ash Lye', desc: 'Cocoa potash is dissolved in water to create a natural lye solution — the soap\'s alkaline base.' },
  { step: '02', title: 'Blend Oils', desc: 'Shea butter, palm oil and coconut oil are gently heated and combined.' },
  { step: '03', title: 'Saponification', desc: 'The lye and oils are combined and stirred until saponification produces true soap.' },
  { step: '04', title: 'Cure & Set', desc: 'The soap is poured, cooled and cured for optimal hardness and lather quality.' },
  { step: '05', title: 'Quality Control', desc: 'Each batch is tested for pH balance, texture and scent before packaging.' },
];

export default function AfricanBlackSoapPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-700 via-amber-600 to-orange-800 text-white pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-amber-200 text-sm mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">African Black Soap</span>
          </nav>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 text-amber-200 text-sm font-medium mb-6">
                <FaStar className="w-3.5 h-3.5" />
                New Service
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                African Black Soap<br />
                <span className="text-amber-200">Supply</span>
              </h1>
              <p className="text-orange-100 text-lg leading-relaxed mb-8">
                Nashma sources and supplies authentic African Black Soap — crafted in the West African tradition with cocoa potash, shea butter and natural plant oils. A powerful yet gentle cleanser trusted across generations for healthy, radiant skin.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-white text-amber-700 hover:bg-amber-50 font-semibold px-6 py-3 rounded-xl transition-all shadow-lg"
                >
                  <FaHeart className="w-4 h-4" />
                  Enquire Now
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white text-white font-semibold px-6 py-3 rounded-xl transition-all hover:bg-white/10"
                >
                  All Services
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:w-72 flex-shrink-0">
              {[
                { value: '5+', label: 'Natural Ingredients' },
                { value: '0', label: 'Synthetic Chemicals' },
                { value: 'All', label: 'Skin Types Suitable' },
                { value: 'GH', label: 'Traditionally Crafted' },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center">
                  <div className="text-2xl font-extrabold text-white mb-1">{s.value}</div>
                  <div className="text-amber-200 text-xs leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-4 bg-amber-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-green-900 mb-4">A Tradition of Clean, Healthy Skin</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                African Black Soap — known as <em className="font-semibold text-amber-700">Alata Samina</em> in Ghana — has been made by West African women for centuries. It earns its distinctive dark color from the natural plant ashes and oils used in its creation.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                At Nashma, we source and supply authentic African Black Soap crafted with high-quality cocoa potash as the alkaline base, blended with shea butter from women cooperatives in Northern Ghana. Every bar preserves the traditional authenticity that makes this soap so effective.
              </p>
              <ul className="space-y-3">
                {['Quality-checked in small batches before supply', 'Made with organic cocoa potash as the base', 'Shea butter sourced from women cooperatives', 'Suitable for face, body and hair'].map((pt, i) => (
                  <li key={i} className="flex items-center gap-3 text-green-800">
                    <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
                <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                  <FaFlask className="w-4 h-4" /> Key Ingredients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ing, i) => (
                    <div key={i} className={`rounded-xl px-3 py-2 text-sm font-medium ${ing.color}`}>
                      <div className="font-semibold">{ing.name}</div>
                      <div className="text-xs opacity-75">{ing.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-green-900 mb-3">Skin Benefits</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Why thousands of people across Africa and the world trust African Black Soap for their skincare routine.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="font-bold text-green-900 mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Production Process */}
      <section className="py-20 px-4 bg-green-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-green-900 mb-3">How It's Made</h2>
            <p className="text-gray-500 max-w-xl mx-auto">The traditional process — unchanged for generations — produces soap with unmatched purity and effectiveness.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-green-100 text-center hover:border-amber-300 transition-colors">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-3">{s.step}</div>
                <h3 className="font-bold text-green-900 text-sm mb-2">{s.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-amber-600 to-amber-800 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Sparkles className="w-12 h-12 text-white mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Interested in Nashma Black Soap?</h2>
          <p className="text-amber-100 text-lg mb-10">
            Reach out for product availability, wholesale pricing or private-label partnerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+233545086577" className="inline-flex items-center justify-center gap-2 bg-white text-amber-700 hover:bg-amber-50 font-semibold px-8 py-4 rounded-xl transition-all shadow-lg">
              <Phone className="w-5 h-5" />
              +233 54 508 6577
            </a>
            <a href="mailto:nashmafarms@gmail.com" className="inline-flex items-center justify-center gap-2 border-2 border-white/50 hover:border-white text-white font-semibold px-8 py-4 rounded-xl transition-all hover:bg-white/10">
              <Mail className="w-5 h-5" />
              nashmafarms@gmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
