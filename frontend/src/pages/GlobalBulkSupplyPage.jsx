import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle, Package, Phone, Mail, Shield, FileText } from 'lucide-react';
import { FaWarehouse, FaHandshake, FaBoxOpen } from 'react-icons/fa';

const products = [
  {
    name: 'Cocoa Potash',
    sizes: ['1 kg blocks', '5 kg bags', '25 kg sacks', '50 kg sacks'],
    uses: 'Soap making, food processing, organic farming',
    icon: '🧱',
  },
  {
    name: 'African Black Soap',
    sizes: ['500 g bars', '5 kg blocks', '25 kg blocks'],
    uses: 'Retail skincare, private label, wholesale',
    icon: '🧼',
  },
  {
    name: 'Shea Butter (Raw)',
    sizes: ['5 kg tubs', '25 kg drums'],
    uses: 'Cosmetics, pharmaceuticals, food industry',
    icon: '🌿',
  },
];

const orderProcess = [
  { step: '01', title: 'Inquiry & Quote', desc: 'Contact us with your product, quantity and location. We\'ll respond within 24 hours with a quote.' },
  { step: '02', title: 'Samples', desc: 'We send product samples for your quality assessment before committing to a bulk order.' },
  { step: '03', title: 'Order Confirmation', desc: 'Confirm quantity, packaging requirements and delivery details.' },
  { step: '04', title: 'Production & QC', desc: 'Your order is prepared, tested and quality-checked to your specification.' },
  { step: '05', title: 'Packaging', desc: 'Products are packed to your preferred format — bags, drums, blocks or custom packaging.' },
  { step: '06', title: 'Delivery', desc: 'Goods are dispatched to your location across Ghana, with full documentation handed over.' },
];

export default function GlobalBulkSupplyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-900 text-white pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-blue-200 text-sm mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Bulk Supply</span>
          </nav>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 text-blue-200 text-sm font-medium mb-6">
                <FaBoxOpen className="w-4 h-4" />
                Bulk Orders
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                Bulk Supply<br />
                <span className="text-blue-300">Across Ghana</span>
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-8">
                Nashma Agribusiness supplies premium agro-products — cocoa potash, African black soap and shea butter — in bulk to businesses and buyers across Ghana. We handle packaging, quality control and delivery so you can focus on your business.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg"
                >
                  <FileText className="w-4 h-4" />
                  Request a Quote
                </Link>
                <a
                  href="tel:+233545086577"
                  className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white text-white font-semibold px-6 py-3 rounded-xl transition-all hover:bg-white/10"
                >
                  <Phone className="w-4 h-4" />
                  Speak to Sales
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:w-72 flex-shrink-0">
              {[
                { value: '3+', label: 'Product Lines' },
                { value: '100%', label: 'Natural Products' },
                { value: '24h', label: 'Quote Response Time' },
                { value: 'GH', label: 'Proudly Ghanaian' },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center">
                  <div className="text-2xl font-extrabold text-blue-200 mb-1">{s.value}</div>
                  <div className="text-blue-300 text-xs leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Nashma for Bulk */}
      <section className="py-20 px-4 bg-blue-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-green-900 mb-4">Your Reliable Ghanaian Supplier</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Whether you're a soap maker, a cosmetics business, a food processor or a retailer, Nashma provides consistent quality, reliable supply and flexible packaging for all your bulk needs.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                We work directly with farming cooperatives across Ghana's best agricultural zones — so you get the most authentic, traceable product possible at a fair price.
              </p>
              <ul className="space-y-3">
                {[
                  'Direct farm-to-business supply chain',
                  'Flexible quantities — contact us to discuss your needs',
                  'Custom packaging available',
                  'Consistent quality across every order',
                  'Dedicated point of contact for bulk buyers',
                  'Delivery within Ghana',
                ].map((pt, i) => (
                  <li key={i} className="flex items-center gap-3 text-green-800">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              {[
                { icon: <Shield className="w-5 h-5" />, title: 'Quality Assurance', desc: 'Every batch tested for purity, moisture and consistency before dispatch.', color: 'text-blue-600 bg-blue-100' },
                { icon: <FaWarehouse className="w-5 h-5" />, title: 'Storage & Handling', desc: 'Proper storage ensures product integrity from production to delivery.', color: 'text-teal-600 bg-teal-100' },
                { icon: <Package className="w-5 h-5" />, title: 'Flexible Packaging', desc: 'Available in standard pack sizes or custom formats to suit your business.', color: 'text-indigo-600 bg-indigo-100' },
                { icon: <FaHandshake className="w-5 h-5" />, title: 'Long-Term Partnerships', desc: 'We prefer ongoing supply relationships that benefit both parties.', color: 'text-green-600 bg-green-100' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-blue-100 p-5 shadow-sm flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-green-900 mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products available for bulk */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-green-900 mb-3">Products Available for Bulk Order</h2>
            <p className="text-gray-500 max-w-xl mx-auto">All products are available in multiple pack sizes. Contact us to discuss your specific requirements.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {products.map((p, i) => (
              <div key={i} className="border border-blue-100 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="text-5xl mb-4">{p.icon}</div>
                <h3 className="text-lg font-bold text-green-900 mb-3">{p.name}</h3>
                <div className="mb-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Available Sizes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.sizes.map((s, j) => (
                      <span key={j} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Common Uses</p>
                  <p className="text-sm text-gray-600">{p.uses}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Process */}
      <section className="py-20 px-4 bg-indigo-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-green-900 mb-3">How to Place a Bulk Order</h2>
            <p className="text-gray-500 max-w-xl mx-auto">From first inquiry to delivery — a simple, reliable process.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderProcess.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100 hover:border-blue-300 transition-colors">
                <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm mb-4">{s.step}</div>
                <h3 className="font-bold text-green-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-800 to-indigo-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <FaBoxOpen className="w-12 h-12 text-blue-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to Place a Bulk Order?</h2>
          <p className="text-blue-100 text-lg mb-10">
            Send us your inquiry — product, quantity and delivery location. We'll respond within 24 hours with a quote.
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
