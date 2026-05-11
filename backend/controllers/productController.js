const Product = require('../models/Product');

// GET /api/products
const getAllProducts = async (req, res) => {
  try {
    console.log('🔍 Fetching products...');
    console.log('🔍 Product model collection:', Product.collection.name);
    
    // Count documents first
    const count = await Product.countDocuments();
    console.log('📊 Total products in collection:', count);
    
    // Get all products
    const products = await Product.find();
    console.log('📦 Products fetched:', products.length);
    
    if (products.length > 0) {
      console.log('🆔 First product ID:', products[0]._id);
      console.log('📅 First product created:', products[0].createdAt);
      console.log('🏷️ First product name:', products[0].name);
    }
    
    res.json(products);
  } catch (error) {
    console.error('❌ Error in getAllProducts:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// Build a full URL for an uploaded file
function fileUrl(req, filename) {
  return `${req.protocol}://${req.get('host')}/uploads/products/${filename}`;
}

// POST /api/products (admin only)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, status } = req.body;
    const countInStock = req.body.countInStock ?? req.body.stock ?? 0;
    const image = req.file ? fileUrl(req, req.file.filename) : req.body.image;
    if (!image) return res.status(400).json({ success: false, message: 'Product image is required' });
    const product = await Product.create({ name, description, price, countInStock, image, status });
    res.status(201).json({ success: true, data: { product } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/products/:id (admin only)
const updateProduct = async (req, res) => {
  try {
    const allowed = ['name', 'description', 'price', 'status'];
    const fields = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) fields[f] = req.body[f]; });
    if (req.body.countInStock !== undefined) fields.countInStock = req.body.countInStock;
    else if (req.body.stock !== undefined) fields.countInStock = req.body.stock;
    // Only update image if a new file was uploaded; keep existing otherwise
    if (req.file) fields.image = fileUrl(req, req.file.filename);

    const product = await Product.findByIdAndUpdate(req.params.id, fields, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: { product } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/products/:id (admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/categories — static Nashma product categories
const getCategories = async (req, res) => {
  const categories = [
    { id: 'potash', label: 'Cocoa Potash', description: 'Organic potash from cocoa pods' },
    { id: 'black-soap', label: 'African Black Soap', description: 'Natural chemical-free soap' },
    { id: 'farm-inputs', label: 'Farm Inputs', description: 'Fertilisers and agro-inputs' },
    { id: 'training', label: 'Training Kits', description: 'Starter kits for potash making' },
    { id: 'commodities', label: 'Agro-Commodities', description: 'Bulk agricultural products' },
  ];
  res.json({ status: 'success', data: categories });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
};