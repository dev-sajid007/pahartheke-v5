import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },

  externalProductId: {
    type: String,
    required: true
  },

  productName: {
    type: String,
    required: true
  },

  productImage: {
    type: String
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  total: {
    type: Number,
    required: true,
    min: 0
  },

  variantId: {
    type: String
  },

  variantName: {
    type: String
  },

  sku: {
    type: String
  }
});

const orderSchema = new mongoose.Schema({
  // Order information
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },

  // Customer information
  customerName: {
    type: String,
    required: true,
    trim: true
  },

  customerPhone: {
    type: String,
    required: true,
    trim: true
  },

  customerEmail: {
    type: String,
    trim: true,
    lowercase: true
  },

  customerAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'Bangladesh'
    }
  },

  // Order items
  items: [orderItemSchema],

  // Pricing
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },

  discount: {
    type: Number,
    default: 0,
    min: 0
  },

  tax: {
    type: Number,
    default: 0,
    min: 0
  },

  shipping: {
    type: Number,
    default: 0,
    min: 0
  },

  grandTotal: {
    type: Number,
    required: true,
    min: 0
  },

  // Payment information
  paymentMethod: {
    type: String,
    enum: ['cash', 'bkash', 'nagad', 'card', 'bank_transfer'],
    default: 'cash'
  },

  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },

  paymentTransactionId: {
    type: String
  },

  // Order status
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded'
    ],
    default: 'pending'
  },

  // Delivery information
  deliveryNotes: {
    type: String
  },

  estimatedDeliveryDate: {
    type: Date
  },

  deliveredAt: {
    type: Date
  },

  // Metadata
  notes: {
    type: String
  },

  ipAddress: {
    type: String
  },

  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Generate order number BEFORE validation so the required check passes
orderSchema.pre('validate', async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Get count of today's orders
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    const todaysOrderCount = await this.constructor.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay }
    });

    const orderNumber = `ORD-${year}${month}${day}-${String(todaysOrderCount + 1).padStart(4, '0')}`;
    this.orderNumber = orderNumber;
  }
  next();
});

// Indexes for better query performance
// orderNumber index is already created by unique: true in the field definition
orderSchema.index({ customerPhone: 1 });
orderSchema.index({ customerEmail: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;