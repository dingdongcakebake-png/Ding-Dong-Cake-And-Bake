import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateOrder } from '../middleware/validation.js';
import {
  sendOrderConfirmation,
  sendAdminNewOrderEmail,
} from '../services/emailService.js';
import { sendWhatsAppOrderConfirmation } from '../services/whatsappService.js';

const router = express.Router();

/* =========================================================
   POST /api/orders - Create new order
========================================================= */
router.post(
  '/',
  validateOrder,
  asyncHandler(async (req, res) => {
    const { customerInfo, items, deliveryOption, notes } = req.body;

    // 🔥 IMPORTANT: always store email in lowercase
    customerInfo.email = customerInfo.email.toLowerCase();

    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item._id || item.productId);

      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.name}" is not available`,
        });
      }

      if (product.stock !== undefined && product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      calculatedTotal += itemTotal;

      validatedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });

      if (product.stock !== undefined) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    // Validate delivery address
    if (deliveryOption === 'delivery') {
      if (
        !customerInfo.address ||
        !customerInfo.city ||
        !customerInfo.pincode
      ) {
        return res.status(400).json({
          success: false,
          message: 'Delivery address is required for home delivery',
        });
      }
    }

    const order = new Order({
      customerInfo,
      items: validatedItems,
      total: calculatedTotal,
      deliveryOption,
      paymentMethod: 'cod',
      notes,
    });

    const savedOrder = await order.save();

    // Send notifications (non-blocking)
    Promise.all([
      sendOrderConfirmation(savedOrder).catch((err) =>
        console.error('Customer email failed:', err.message)
      ),
      sendAdminNewOrderEmail(savedOrder).catch((err) =>
        console.error('Admin email failed:', err.message)
      ),
      sendWhatsAppOrderConfirmation(savedOrder).catch((err) =>
        console.error('WhatsApp failed:', err.message)
      ),
    ]);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: savedOrder,
    });
  })
);

/* =========================================================
   GET /api/orders/user/:email
   ✅ CASE-INSENSITIVE (old + new orders)
========================================================= */
router.get(
  '/user/:email',
  asyncHandler(async (req, res) => {
    const { email } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const searchEmail = email.trim();

    const emailQuery = {
      $regex: `^${searchEmail}$`,
      $options: 'i', // 🔥 case-insensitive
    };

    const orders = await Order.find({
      'customerInfo.email': emailQuery,
    })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const total = await Order.countDocuments({
      'customerInfo.email': emailQuery,
    });

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  })
);

/* =========================================================
   GET /api/orders/:id - Get single order
========================================================= */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  })
);

export default router;
