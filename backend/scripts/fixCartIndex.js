const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

async function fixCartIndex() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const db = mongoose.connection.db;
  const collection = db.collection('carts');

  const indexes = await collection.indexes();
  console.log('Current indexes:', indexes.map(i => i.name));

  // Drop old userId index if it exists
  for (const idx of indexes) {
    if (idx.key && idx.key.userId !== undefined) {
      await collection.dropIndex(idx.name);
      console.log(`✅ Dropped old index: ${idx.name}`);
    }
  }

  console.log('Done. Remaining indexes:', (await collection.indexes()).map(i => i.name));
  await mongoose.disconnect();
}

fixCartIndex().catch(err => {
  console.error('❌ Failed:', err.message);
  process.exit(1);
});
