import { Router } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

const PAYMENT_METHOD_MAP = {
  cash_on_delivery: 'cash',
  online: 'bkash',
};

const PAYMENT_STATUS_MAP = {
  unpaid: 'pending',
  pending: 'pending',
  paid: 'paid',
};

function transformOrderPayload(body) {
  const { shipping_address, cart_items, payment_type, payment_status, coupon_code, coupon_discount } = body;

  const subtotal = (cart_items || []).reduce((sum, item) => {
    return sum + (Number(item.price) || 0) * (Number(item.quantity) || 1);
  }, 0);

  const shipping = subtotal > 0 ? 80 : 0;
  const discount = Number(coupon_discount) || 0;
  const grandTotal = Math.max(subtotal + shipping - discount, 0);

  return {
    customerName: shipping_address?.full_name || '',
    customerPhone: shipping_address?.phone || '',
    customerEmail: shipping_address?.email || '',
    customerAddress: {
      street: shipping_address?.address || '',
      city: shipping_address?.city || '',
      state: shipping_address?.area || '',
      zipCode: shipping_address?.zip_code || '',
      country: shipping_address?.country || 'Bangladesh',
    },
    items: (cart_items || []).map((item) => ({
      externalProductId: String(item.product_id || ''),
      productName: item.name || item.product_name || '',
      productImage: item.image || '',
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0,
      total: (Number(item.price) || 0) * (Number(item.quantity) || 1),
      variantId: item.variant_id || item.variantId || item.variation_id || item.variationId || null,
      variantName: item.variant_name || item.variantName || item.variation || item.variation_name || null,
      sku: item.sku || item.variant_sku || item.variantSku || null,
    })),
    subtotal,
    discount,
    tax: 0,
    shipping,
    grandTotal,
    paymentMethod: PAYMENT_METHOD_MAP[payment_type] || 'cash',
    paymentStatus: PAYMENT_STATUS_MAP[payment_status] || 'pending',
    notes: shipping_address?.order_note || '',
    deliveryNotes: '',
  };
}

router.get('/', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { status, paymentStatus, customerPhone, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (customerPhone) filter.customerPhone = customerPhone;

    const orders = await Order.find(filter)
      .populate('items.product')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);

    res.json({ success: true, data: orders, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const transformedData = transformOrderPayload(req.body);

    // Optionally resolve MongoDB product refs (items without a match just save without product ref)
    for (const item of transformedData.items) {
      if (item.externalProductId) {
        try {
          const found = await Product.findOne({ _id: item.externalProductId }).select('_id').lean();
          if (found) item.product = found._id;
        } catch (_) {
          // externalProductId may not be a valid ObjectId — that's fine, product ref stays unset
        }
      }
    }

    const order = await Order.create(transformedData);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
