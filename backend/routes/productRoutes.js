const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} = require('../controllers/productController');

router.get('/categories', getCategories);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/',   protect, restrictTo('admin'), upload.single('image'), createProduct);
router.put('/:id', protect, restrictTo('admin'), upload.single('image'), updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

module.exports = router;
