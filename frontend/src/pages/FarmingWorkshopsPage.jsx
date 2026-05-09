import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle, Leaf, Calendar, Users, Clock, ArrowRight, Phone, Mail, BookOpen, Sprout } from 'lucide-react';
import { FaLeaf, FaSeedling, FaTractor, FaRecycle } from 'react-icons/fa';

const workshops = [
  {
    icon: <FaRecycle className="w-6 h-6" />,
    title: 'Cocoa Pod Waste Utilisation',
    duration: '1 Day',
    audience: 'Cocoa farmers',
    desc: 'Transform cocoa pod husks — normally discarded — into valuable potash for personal use or sale. Learn the full process from burning through to packaging.',
    topics: ['Pod collection and drying', 'Burning and ash processing', 'Quality assessment', 'Storage and packaging'],
    color: 'border-green-200 bg-green-50',
    iconColor: 'text-green-600 bg-green-100',
  },
  {
    icon: <FaSeedling className="w-6 h-6" />,
    title: 'Organic Composting & Soil Health',
    duration: '2 Days',
    audience: 'Smallholder farmers',
    desc: 'Build healthy, productive soils using on-farm waste. Covers compost creation, green manures, cover crops and natural pest management.',
    topics: ['Composting methods and bins', 'Green manure crops', 'Natural pest management', 'Soil testing basics'],
    color: 'border-teal-200 bg-teal-50',
    iconColor: 'text-teal-600 bg-teal-100',
  },
  {
    icon: <FaTractor className="w-6 h-6" />,
    title: 'Sustainable Crop Management',
    duration: '3 Days',
    audience: 'Farmers & extension workers',
    desc: 'Intercropping, crop rotation, water management and post-harvest handling — practical techniques to increase yield while protecting the land.',
    topics: ['Intercropping strategies', 'Water harvesting and irrigation', 'Post-harvest handling', 'Market-grade produce preparation'],
    color: 'border-amber-200 bg-amber-50',
    iconColor: 'text-amber-600 bg-amber-100',
  },
  {
    icon: <FaLeaf className="w-6 h-6" />,
    title: 'Agroforestry & Tree Planting',
    duration: '1 Day',
    audience: 'Cocoa & food crop farmers',
    desc: 'Integrate trees into your farm to improve shade, soil fertility and income diversification. Covers species selection, spacing and management.',
    topics: ['Shade tree selection', 'Planting and spacing', 'Pruning and management', 'Carbon and biodiversity benefits'],
    color: 'border-lime-200 bg-lime-50',
    iconColor: 'text-lime-600 bg-lime-100',
  },
];

const agenda = [
  { time: '8:00 AM', activity: 'Registration & Welcome Tea' },
  { time: '8:30 AM', activity: 'Introduction & Programme Overview' },
  { time: '9:00 AM', activity: 'Morning Session — Theory & Demonstration' },
  { time: '12:00 PM', activity: 'Lunch Break' },
  { time: '1:00 PM', activity: 'Afternoon Session — Hands-On Practice' },
  { time: '4:00 PM', activity: 'Q&A, Wrap-Up & Certificate Presentation' },
];

export default function FarmingWorkshopsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-800 via-green-700 to-teal-900 text-white pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-teal-200 text-sm mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Farming Workshops</span>
          </nav>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 text-teal-200 text-sm font-medium mb-6">
                <FaLeaf className="w-4 h-4" />
                Sustainable Agriculture
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                Sustainable Farming<br />
                <span className="text-teal-300">Workshops</span>
              </h1>
              <p className="text-teal-100 text-lg leading-relaxed mb-8">
                Nashma Agribusiness runs practical, farm-based workshops that teach Ghanaian farmers how to produce more, waste less and protect the land for future generations — using techniques proven in local conditions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg"
                >
                  <Calendar className="w-5 h-5" />
                  Book a Workshop
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
              {[
                { value: '4', label: 'Workshop Types' },
                { value: '1–3', label: 'Days per Workshop' },
                { value: 'On-Site', label: 'Farm-Based Learning' },
                { value: '🌱', label: 'Certificate Awarded' },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center">
                  <div className="text-2xl font-extrabold text-teal-200 mb-1">{s.value}</div>
                  <div className="text-teal-300 text-xs leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 px-4 bg-teal-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-green-900 mb-4">Learning That Happens in the Field</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our workshops are built for farmers, not classrooms. Every programme includes live demonstrations on real farms, hands-on practice with actual tools and materials, and take-home reference guides in local languages.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Delivered by Nashma's experienced agronomists and practitioners, each workshop is tailored to the local farming context and the specific challenges participants face.
              </p>
              <ul className="space-y-3">
                {[
                  'Practical field demonstrations — not just lectures',
                  'Local language facilitation available',
                  'Take-home reference guides and toolkits',
                  'Follow-up farm visits for registered participants',
                  'Certificate of completion provided',
                  'Group discounts for cooperatives and NGOs',
                ].map((pt, i) => (
                  <li key={i} className="flex items-center gap-3 text-green-800">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sample Day Agenda */}
            <div className="bg-white rounded-2xl border border-teal-100 shadow-sm overflow-hidden">
              <div className="bg-teal-700 text-white px-6 py-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Sample Workshop Day
                </h3>
              </div>
              <div className="p-4">
                {agenda.map((item, i) => (
                  <div key={i} className={`flex items-center gap-4 py-3 ${i < agenda.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <span className="text-xs font-bold text-teal-700 w-16 flex-shrink-0">{item.time}</span>
                    <span className="text-sm text-gray-700">{item.activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workshops */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-green-900 mb-3">Available Workshops</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Choose the workshop that fits your farming context. Multiple workshops can be combined into a multi-day programme.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {workshops.map((w, i) => (
              <div key={i} className={`rounded-2xl border-2 p-6 ${w.color} hover:shadow-md transition-shadow`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${w.iconColor}`}>
                    {w.icon}
                  </div>
                  <div>
                    <div className="flex gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full">
                        <Clock className="w-3 h-3 inline mr-1" />{w.duration}
                      </span>
                      <span className="text-xs font-bold bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full">
                        <Users className="w-3 h-3 inline mr-1" />{w.audience}
                      </span>
                    </div>
                    <h3 className="font-bold text-green-900">{w.title}</h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{w.desc}</p>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Topics covered:</p>
                  <ul className="space-y-1.5">
                    {w.topics.map((t, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-green-800">
                        <Leaf className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who should attend */}
      <section className="py-20 px-4 bg-green-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-green-900 mb-3">Who Should Attend?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '👨‍🌾', title: 'Smallholder Farmers', desc: 'Looking to improve yields and reduce on-farm waste.' },
              { icon: '🏢', title: 'Agribusiness Owners', desc: 'Seeking sustainable production and efficiency improvements.' },
              { icon: '🎓', title: 'Extension Workers', desc: 'NGO and government staff wanting to deliver better farmer support.' },
              { icon: '🌍', title: 'Cooperatives & Groups', desc: 'Community groups seeking group training at discounted rates.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-green-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-teal-700 to-green-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Sprout className="w-12 h-12 text-teal-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to Book a Workshop?</h2>
          <p className="text-teal-100 text-lg mb-10">
            Contact us to schedule a workshop for your farm, cooperative or organisation. We'll tailor the programme to your needs and location.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+233545086577" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg">
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
