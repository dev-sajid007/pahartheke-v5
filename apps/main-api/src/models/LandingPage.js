import mongoose from 'mongoose';

const landingPageSectionSchema = new mongoose.Schema({
  sectionType: {
    type: String,
    enum: [
      'hero',
      'featured_products',
      'best_sellers',
      'popular_items',
      'categories',
      'promo_banner',
      'testimonials',
      'about',
      'contact',
      'newsletter',
      'footer',
      'delivery_charges'
    ],
    required: true
  },

  title: {
    type: String,
    required: true
  },

  subtitle: {
    type: String
  },

  content: {
    type: String
  },

  // For hero section
  heroImage: {
    type: String
  },

  ctaText: {
    type: String
  },

  ctaLink: {
    type: String
  },

  // For featured products
  featuredProductIds: [{
    type: String
  }],

  // For categories
  categoryIds: [{
    type: String
  }],

  // For banners
  bannerImage: {
    type: String
  },

  bannerLink: {
    type: String
  },

  // For testimonials
  testimonials: [{
    name: String,
    position: String,
    content: String,
    avatar: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],

  // Section styling
  backgroundColor: {
    type: String,
    default: '#ffffff'
  },

  textColor: {
    type: String,
    default: '#000000'
  },

  // Ordering
  order: {
    type: Number,
    default: 0
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },

  // Metadata
  lastUpdatedBy: {
    type: String
  }
}, {
  timestamps: true
});

const landingPageSchema = new mongoose.Schema({
  // Page identifier
  pageName: {
    type: String,
    required: true,
    unique: true,
    enum: ['home', 'about', 'contact', 'shop', 'offers']
  },

  // Page metadata
  metaTitle: {
    type: String
  },

  metaDescription: {
    type: String
  },

  metaKeywords: [{
    type: String
  }],

  // Page sections
  sections: [landingPageSectionSchema],

  // Page settings
  isPublished: {
    type: Boolean,
    default: false
  },

  publishedAt: {
    type: Date
  },

  // Versioning
  version: {
    type: Number,
    default: 1
  },

  // Audit trail
  createdBy: {
    type: String
  },

  updatedBy: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes
// pageName index is already created by unique: true in the field definition
landingPageSchema.index({ isPublished: 1 });
landingPageSchema.index({ 'sections.sectionType': 1 });

const LandingPage = mongoose.model('LandingPage', landingPageSchema);

export default LandingPage;