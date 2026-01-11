import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateProduct, validateOrderStatus } from '../middleware/validation.js';
import { sendOrderStatusUpdate } from '../services/emailService.js';
import { sendWhatsAppStatusUpdate } from '../services/whatsappService.js';

const router = express.Router();

// PRODUCTS CRUD

// GET /api/admin/products - Get all products (including inactive)
router.get('/products', asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    success: true,
    data: products,
  });
}));

// POST /api/admin/products - Create new product
router.post('/products', validateProduct, asyncHandler(async (req, res) => {
  const product = new Product(req.body);
  const savedProduct = await product.save();

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: savedProduct,
  });
}));

// PUT /api/admin/products/:id - Update product
router.put('/products/:id', validateProduct, asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: product,
  });
}));

// DELETE /api/admin/products/:id - Delete product (soft delete)
router.delete('/products/:id', asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
}));

// ORDERS MANAGEMENT

// GET /api/admin/orders - Get all orders
router.get('/orders', asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
  
  const filter = {};
  if (status && status !== 'all') {
    filter.status = status;
  }

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Order.countDocuments(filter);

  res.json({
    success: true,
    data: orders,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

// PUT /api/admin/orders/:id/status - Update order status
router.put('/orders/:id/status', validateOrderStatus, asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  // Send notifications for status updates (don't block response)
  if (status !== 'pending') {
    Promise.all([
      sendOrderStatusUpdate(order, status).catch(err => 
        console.error('Failed to send status update email:', err.message)
      ),
      sendWhatsAppStatusUpdate(order, status).catch(err => 
        console.error('Failed to send WhatsApp status update:', err.message)
      ),
    ]);
  }

  res.json({
    success: true,
    message: 'Order status updated successfully',
    data: order,
  });
}));

// GET /api/admin/stats - Get dashboard statistics
router.get('/stats', asyncHandler(async (req, res) => {
  const [
    totalProducts,
    totalOrders,
    pendingOrders,
    completedOrders,
  ] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Order.find({ status: 'completed' }).lean(),
  ]);

  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

  // Get recent orders (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentOrders = await Order.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });

  res.json({
    success: true,
    data: {
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      recentOrders,
      completedOrdersCount: completedOrders.length,
    },
  });
}));

export default router;