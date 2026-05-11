import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, CheckCircle, Package, Truck, Leaf, ArrowRight, Phone, Mail } from 'lucide-react';
import { FaRecycle, FaFlask, FaBoxOpen, FaWarehouse, FaSeedling } from 'react-icons/fa';
import apiClient from '../utils/apiClient';

const steps = [
  { step: '01', title: 'Pod Collection', desc: 'Dry cocoa pods are collected from farms across the growing regions of Ghana.' },
  { step: '02', title: 'Controlled Burning', desc: 'Pods are burned at precise temperatures to produce pure, high-quality potash ash.' },
  { step: '03', title: 'Sieving & Refining', desc: 'The ash is carefully sieved and refined to remove impurities, ensuring consistent quality.' },
  { step: '04', title: 'Quality Testing', desc: 'Every batch is tested for purity, alkalinity and moisture before packaging.' },
  { step: '05', title: 'Packaging & Dispatch', desc: 'Packed in 1 kg blocks, 5 kg bags, 25 kg or 50 kg sacks and dispatched to customers.' },
];

const uses = [
  { icon: <FaFlask className="w-6 h-6" />, title: 'Soap Making', desc: 'Primary alkali used in traditional African black soap production.' },
  { icon: <FaSeedling className="w-6 h-6" />, title: 'Organic Farming', desc: 'Used as a natural soil amendment to balance pH and enrich soil nutrients.' },
  { icon: <FaBoxOpen className="w-6 h-6" />, title: 'Food Processing', desc: 'Used in cooking taro, beans and other staples to soften texture and enhance taste.' },
  { icon: <FaWarehouse className="w-6 h-6" />, title: 'Industrial Use', desc: 'Input for cosmetic manufacturers, food-processing plants and agro-processors.' },
];

// Pack size config — defaultPrice is the fallback if not found in the database.
// Admin can override any price by editing the matching product in the admin panel.
const PACK_SIZES = [
  { kg: 1,  name: 'Raw Blocks (1 kg)',      desc: 'Traditional solid form — ideal for households and soap makers.',          image: '/cocoa-potash-1kg.jpg',        defaultPrice: 32 },
  { kg: 5,  name: 'Packaged Bags (5 kg)',   desc: 'Convenience-sized bags for small businesses and workshops.',             image: '/cocoa-potash5kg.jpg',         defaultPrice: 160 },
  { kg: 25, name: 'Bulk Sacks (25 kg)',     desc: 'Industrial sacks for manufacturers and export buyers.',                  image: '/cocoa-potash-25kg.jpg',       defaultPrice: 800 },
  { kg: 50, name: 'Bulk Sacks (50 kg)',     desc: 'Extra-large bulk sacks for high-volume manufacturers and exporters.',    image: '/cocoa-potash-raw-blocks.jpg', defaultPrice: null },
];

// Match a database product to a pack size by looking for the kg number in its name
function matchProduct(apiProducts, kg) {
  return apiProducts.find(p => {
    const n = (p.name || '').toLowerCase().replace(/\s+/g, '');
    return n.includes(`${kg}kg`) || n.includes(`(${kg}kg`) || n.includes(`${kg}kg)`);
  });
}

function formatPrice(price) {
  return `GHS ${Number(price).toFixed(2)}`;
}

export default function CocoaPotashPage() {
  // Fetch all products so prices stay in sync with the admin panel
  const { data: apiProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await apiClient.getProducts({});
      return res.data?.products || res.data || [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Build the final products list — API price wins over the default
  const products = PACK_SIZES.map(size => {
    const found = matchProduct(apiProducts, size.kg);
    const livePrice = found?.price > 0 ? formatPrice(found.price) : null;
    const fallback  = size.defaultPrice ? formatPrice(size.defaultPrice) : 'Contact for price';
    return { ...size, price: livePrice || fallback, isLive: !!livePrice };
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-green-300 text-sm mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Cocoa Potash Production</span>
          </nav>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-6">
                <FaRecycle className="w-4 h-4" />
                Flagship Product
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                Cocoa Potash<br />
                <span className="text-amber-400">Production</span>
              </h1>
              <p className="text-green-100 text-lg leading-relaxed mb-8">
                Nashma Agribusiness produces premium-grade cocoa potash (potassium carbonate) from sustainably harvested cocoa pods using traditional Ghanaian methods — delivering 100% natural, chemical-free potash for soap makers, farmers, food processors and export markets worldwide.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  <Package className="w-5 h-5" />
                  View Products
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white text-white font-semibold px-6 py-3 rounded-xl transition-all hover:bg-white/10"
                >
                  Contact for Bulk Orders
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:w-72 flex-shrink-0">
              {[
                { value: '100%', label: 'Natural & Chemical-Free' },
                { value: '4', label: 'Pack Sizes Available' },
                { value: '50 kg', label: 'Max Bulk Sack Size' },
                { value: 'Export', label: 'Ready for Global Markets' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center">
                  <div className="text-2xl font-extrabold text-amber-400 mb-1">{stat.value}</div>
                  <div className="text-green-200 text-xs leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What is Cocoa Potash */}
      <section className="py-20 px-4 bg-green-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-green-900 mb-4">What is Cocoa Potash?</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Cocoa potash — known locally as <em className="font-semibold text-green-700">Kantu</em> — is a potassium-rich alkaline ash produced by burning dried cocoa pod husks. It has been used in West African households and industries for centuries.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                At Nashma, we refine this traditional process with modern quality controls to produce consistent, high-purity potash that meets the needs of both small-scale artisans and industrial buyers.
              </p>
              <ul className="space-y-3">
                {['100% organic — zero synthetic additives', 'High potassium carbonate content', 'Suitable for food, cosmetic & agricultural use', 'Available in retail and bulk quantities'].map((pt, i) => (
                  <li key={i} className="flex items-center gap-3 text-green-800">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src="/cocoa-potash-5kg.jpg"
                alt="Cocoa Potash 5kg"
                className="w-full h-72 object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="p-6">
                <p className="text-sm text-gray-500 italic">Nashma Cocoa Potash — packaged for retail and wholesale markets.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Process */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-green-900 mb-3">Our Production Process</h2>
            <p className="text-gray-500 max-w-xl mx-auto">From raw cocoa pod to finished product — every step is carefully managed to ensure purity and consistency.</p>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-0.5 bg-green-200" />
            <div className="space-y-8">
              {steps.map((s, i) => (
                <div key={i} className={`flex flex-col lg:flex-row items-center gap-6 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={`flex-1 ${i % 2 === 1 ? 'lg:text-right' : ''}`}>
                    <div className="bg-white border border-green-100 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                      <div className="text-amber-500 font-extrabold text-sm mb-2 tracking-widest">STEP {s.step}</div>
                      <h3 className="text-xl font-bold text-green-900 mb-2">{s.title}</h3>
                      <p className="text-gray-600">{s.desc}</p>
                    </div>
                  </div>
                  <div className="z-10 w-12 h-12 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                    {s.step}
                  </div>
                  <div className="flex-1 hidden lg:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Uses */}
      <section className="py-20 px-4 bg-amber-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-green-900 mb-3">Key Uses of Cocoa Potash</h2>
            <p className="text-gray-500 max-w-xl mx-auto">A remarkably versatile natural ingredient used across multiple industries.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {uses.map((u, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-amber-100 transition-shadow text-center">
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mx-auto mb-4">
                  {u.icon}
                </div>
                <h3 className="font-bold text-green-900 mb-2">{u.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-green-900 mb-3">Available Pack Sizes</h2>
            <p className="text-gray-500 max-w-xl mx-auto">From household use to large-scale industrial buyers — we have the right size for every need.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <div key={i} className="border border-green-100 rounded-2xl overflow-hidden hover:border-green-300 hover:shadow-xl transition-all group flex flex-col">
                {/* Product image — fixed height, centred crop */}
                <div className="w-full overflow-hidden bg-gray-50 flex-shrink-0" style={{ height: '240px' }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
                {/* Card body */}
                <div className="p-6 flex flex-col flex-1 text-center">
                  <h3 className="text-base font-bold text-green-900 mb-2">{p.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 flex-1">{p.desc}</p>
                  <div className="mb-3">
                    <span className={`text-xl font-extrabold ${p.price.startsWith('GHS') ? 'text-amber-600' : 'text-green-700'}`}>
                      {p.price}
                    </span>
                    {p.isLive && (
                      <span className="ml-2 text-xs font-semibold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full align-middle">live</span>
                    )}
                  </div>
                  <span className="inline-flex items-center justify-center gap-1 text-xs font-semibold bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
                    Order &amp; we'll confirm
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/products" className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl">
              <Package className="w-5 h-5" />
              Browse All Products
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-green-800 to-green-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Leaf className="w-12 h-12 text-amber-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to Order or Partner With Us?</h2>
          <p className="text-green-200 text-lg mb-10">
            Contact us today for pricing, bulk quotes, export inquiries or to learn more about our cocoa potash products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+233545086577" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg">
              <Phone className="w-5 h-5" />
              +233 54 508 6577
            </a>
            <a href="mailto:nashmafarms@gmail.com" className="inline-flex items-center justify-center gap-2 border-2 border-white/40 hover:border-white text-white font-semibold px-8 py-4 rounded-xl transition-all hover:bg-white/10">
              <Mail className="w-5 h-5" />
              nashmafarms@gmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
