const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// price = 0 means "Price on Request / confirmed at delivery"
const nashmaProducts = [
  {
    name: 'Cocoa Potash 5kg',
    description:
      '100% natural cocoa potash produced and packaged by Nashma Agribusiness Ltd, Apemso-KNUST, Kumasi. Made from cocoa pods and water only — no additives. Components: Cocoa Pods & Water. Uses: Fertilizer, Soap making, Food processing/preservation, Textile dyeing & printing. Comes in a 5kg resealable kraft paper bag.',
    price: 0,
    countInStock: 150,
    image: '/cocoa-potash-5kg.jpg',
    status: 'active',
  },
  {
    name: 'Cocoa Potash 25kg',
    description:
      '100% natural cocoa potash in a heavy-duty 25kg woven sack. Produced and packaged by Nashma Agribusiness Ltd, Apemso-KNUST, Kumasi. Ideal for bulk buyers, farmers, soap manufacturers, and industrial users. No additives.',
    price: 0,
    countInStock: 60,
    image: '/cocoa-potash-25kg.jpg',
    status: 'active',
  },
  {
    name: 'African Black Soap (1kg)',
    description:
      'Handcrafted traditional African Black Soap (Alata Samina) produced by Nashma Agribusiness Ltd. Made from cocoa potash, shea butter, palm oil and plantain ash — 100% natural, no synthetic additives. Benefits: deep cleansing, soothes eczema and acne, natural moisturising. Suitable for face, body and hair. Supplied in 1kg blocks.',
    price: 0,
    countInStock: 200,
    image: '/cocoa-potash-raw-blocks.jpg',
    status: 'active',
  },
  {
    name: 'Shea Butter (Raw) 5kg',
    description:
      'Pure, unrefined shea butter from Nashma Agribusiness. Sourced and packaged naturally with no additives. Rich in vitamins A, E, and fatty acids. Uses: skin moisturizer, hair care, soap making, and natural cooking. Supplied in sealed 5kg blocks.',
    price: 0,
    countInStock: 80,
    image: '/shea-butter-raw.jpg',
    status: 'active',
  },
];

// Products that were renamed — remove old entries so they don't linger
const oldNames = ['Cocoa Potash Raw Blocks (1kg)'];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Remove renamed products
    for (const oldName of oldNames) {
      const deleted = await Product.findOneAndDelete({ name: oldName });
      if (deleted) console.log(`🗑️  Removed old product: ${oldName}`);
    }

    for (const p of nashmaProducts) {
      const updated = await Product.findOneAndUpdate(
        { name: p.name },
        { $set: p },
        { upsert: true, new: true }
      );
      console.log(`✅ Upserted: ${updated.name} (id: ${updated._id})`);
    }

    await mongoose.disconnect();
    console.log('Done.');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
