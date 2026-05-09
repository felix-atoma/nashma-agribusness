import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle, Users, ArrowRight, Phone, Mail, Award, TrendingUp } from 'lucide-react';
import { FaGraduationCap, FaHandHoldingHeart, FaLeaf } from 'react-icons/fa';

const programs = [
  {
    icon: '🧼',
    title: 'Cocoa Potash & Black Soap Production',
    duration: '2-Day Workshop',
    desc: 'Hands-on training in cocoa potash extraction and traditional black soap making. Participants leave with the skills and product to start their own micro-enterprise.',
    outcomes: ['Full production process knowledge', 'Business starter kit', 'Quality testing skills'],
    color: 'border-green-200 bg-green-50',
    badge: 'bg-green-100 text-green-700',
  },
  {
    icon: '🌿',
    title: 'Shea Butter Processing',
    duration: '1-Day Workshop',
    desc: 'Learn to extract, refine and package shea butter from raw nuts — from raw material to market-ready product.',
    outcomes: ['Extraction and refining techniques', 'Packaging and labelling', 'Pricing and market skills'],
    color: 'border-amber-200 bg-amber-50',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    icon: '🌱',
    title: 'Sustainable Smallholder Farming',
    duration: '3-Day Course',
    desc: 'Practical training in organic composting, intercropping, soil health and post-harvest management for cocoa and other crops.',
    outcomes: ['Composting and soil management', 'Crop rotation and intercropping', 'Post-harvest handling'],
    color: 'border-teal-200 bg-teal-50',
    badge: 'bg-teal-100 text-teal-700',
  },
  {
    icon: '📊',
    title: 'Agribusiness & Financial Literacy',
    duration: '1-Day Workshop',
    desc: 'Learn record keeping, pricing, profit margins, savings groups and how to access credit for your agribusiness.',
    outcomes: ['Basic bookkeeping', 'Pricing strategy', 'Access to credit & savings groups'],
    color: 'border-rose-200 bg-rose-50',
    badge: 'bg-rose-100 text-rose-700',
  },
];

const impact = [
  { value: '200+', label: 'Women & Youth Trained', icon: <Users className="w-5 h-5" /> },
  { value: '5', label: 'Communities Reached', icon: <FaHandHoldingHeart className="w-5 h-5" /> },
  { value: '4', label: 'Skills Programs Offered', icon: <FaGraduationCap className="w-5 h-5" /> },
  { value: '80%', label: 'Start Their Own Business', icon: <TrendingUp className="w-5 h-5" /> },
];

export default function WomenYouthTrainingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-700 via-pink-700 to-rose-900 text-white pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-rose-200 text-sm mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Women & Youth Training</span>
          </nav>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 text-rose-200 text-sm font-medium mb-6">
                <FaGraduationCap className="w-4 h-4" />
                Community Empowerment
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                Women & Youth<br />
                <span className="text-pink-300">Skills Training</span>
              </h1>
              <p className="text-rose-100 text-lg leading-relaxed mb-8">
                Nashma Agribusiness believes that agricultural prosperity starts with people. Our training programs equip women and young entrepreneurs with the practical skills, tools and confidence to build sustainable livelihoods from Ghana's natural resources.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-white text-rose-700 hover:bg-rose-50 font-semibold px-6 py-3 rounded-xl transition-all shadow-lg"
                >
                  <FaGraduationCap className="w-4 h-4" />
                  Register Interest
                </Link>
                <a
                  href="tel:+233545086577"
                  className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white text-white font-semibold px-6 py-3 rounded-xl transition-all hover:bg-white/10"
                >
                  <Phone className="w-4 h-4" />
                  Call Us
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:w-72 flex-shrink-0">
              {impact.map((s, i) => (
                <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center">
                  <div className="flex justify-center mb-2 text-rose-200">{s.icon}</div>
                  <div className="text-2xl font-extrabold text-white mb-1">{s.value}</div>
                  <div className="text-rose-200 text-xs leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="py-20 px-4 bg-rose-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-green-900 mb-4">Investing in People, Growing Communities</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Across Ghana's agricultural belt, women and young people are the backbone of food production — yet they often lack access to the technical training, market knowledge and tools needed to truly profit from their work.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Nashma's training programs bridge that gap. We bring our production expertise directly into communities, offering hands-on workshops that participants can immediately apply to generate income.
              </p>
              <ul className="space-y-3">
                {[
                  'Free or subsidised training for qualifying participants',
                  'Practical, hands-on learning — no classroom-only theory',
                  'Starter kits provided to graduates',
                  'Ongoing mentorship and market linkage support',
                  'Programs delivered in local languages',
                ].map((pt, i) => (
                  <li key={i} className="flex items-center gap-3 text-green-800">
                    <CheckCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-8">
              <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-3">Who Should Attend?</h3>
              <ul className="space-y-3 text-gray-600">
                {[
                  'Women in farming communities (18 years and above)',
                  'Youth (18–35) looking to start an agribusiness',
                  'Existing soap/shea butter producers wanting to improve quality',
                  'NGOs and cooperatives seeking training partners',
                  'Schools and vocational institutes',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-green-900 mb-3">Training Programs</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Choose from our range of practical skills workshops, each designed to deliver immediate, income-generating results.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {programs.map((p, i) => (
              <div key={i} className={`rounded-2xl border-2 p-6 ${p.color} hover:shadow-md transition-shadow`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{p.icon}</div>
                  <div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.badge}`}>{p.duration}</span>
                    <h3 className="font-bold text-green-900 mt-2">{p.title}</h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{p.desc}</p>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">You'll learn:</p>
                  <ul className="space-y-1.5">
                    {p.outcomes.map((o, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-green-800">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-rose-700 to-rose-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <FaHandHoldingHeart className="w-12 h-12 text-pink-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Join Our Next Training Session</h2>
          <p className="text-rose-100 text-lg mb-10">
            Contact us to register for an upcoming session, request a workshop for your community, or partner with us to expand the programme.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+233545086577" className="inline-flex items-center justify-center gap-2 bg-white text-rose-700 hover:bg-rose-50 font-semibold px-8 py-4 rounded-xl transition-all shadow-lg">
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
