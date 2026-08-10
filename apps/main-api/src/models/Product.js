import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // External API ID (from pahartheke.com)
  externalId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Product details
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  description: {
    type: String,
    default: ''
  },
  
  price: {
    type: Number,
    required: true,
    min: 0
  },
  
  salePrice: {
    type: Number,
    min: 0
  },
  
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  
  images: [{
    type: String
  }],
  
  category: {
    type: String,
    default: 'Uncategorized'
  },
  
  categoryId: {
    type: String
  },
  
  // Product metadata
  featured: {
    type: Boolean,
    default: false
  },
  
  tags: [{
    type: String,
    lowercase: true
  }],
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock'],
    default: 'active'
  },
  
  // Timestamps from external API
  externalCreatedAt: {
    type: Date
  },
  
  externalUpdatedAt: {
    type: Date
  },
  
  // Local timestamps
  lastSyncedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ status: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;