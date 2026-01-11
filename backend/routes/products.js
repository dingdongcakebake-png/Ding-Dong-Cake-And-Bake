import express from 'express';
import Product from '../models/Product.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /api/products - Get all products with filtering
router.get('/', asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, search, page = 1, limit = 50 } = req.query;
  
  // Build filter object
  const filter = { isActive: true };
  
  if (category && category !== 'all') {
    filter.category = category.toLowerCase();
  }
  
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Product.countDocuments(filter);

  res.json({
    success: true,
    data: products,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

// GET /api/products/categories - Get all categories
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category', { isActive: true });
  
  res.json({
    success: true,
    data: categories,
  });
}));

// GET /api/products/:id - Get single product
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, isActive: true });
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  res.json({
    success: true,
    data: product,
  });
}));

export default router;