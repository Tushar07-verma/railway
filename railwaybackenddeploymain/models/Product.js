/**
 * T-RAYO Production Mongoose Model: Clothing Product
 * 
 * Exclusively designed for clothing and apparel products with strict attribute typing.
 */

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    altText: { type: String, default: 'T-RAYO apparel photo' },
    isPrimary: { type: Boolean, default: false },
    colorRef: { type: String }
  },
  { _id: false }
);

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hexCode: { type: String, required: true }
  },
  { _id: false }
);

const clothingProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: [true, 'Clothing category is required'],
      enum: [
        't-shirts',
        'oversized-t-shirts',
        'hoodies',
        'sweatshirts',
        'shirts',
        'pants',
        'future-clothing'
      ],
      index: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    images: {
      type: [imageSchema],
      validate: [val => val.length > 0, 'At least one product image is required']
    },
    color: {
      type: [colorSchema],
      required: true
    },
    size: {
      type: [String],
      required: true,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'FREE_SIZE'],
      index: true
    },
    gsm: {
      type: Number,
      required: [true, 'GSM (fabric density) is mandatory for apparel specification'],
      min: 50,
      max: 800,
      index: true
    },
    fabric: {
      type: String,
      required: [true, 'Fabric specification is required'],
      trim: true
    },
    material: {
      type: String,
      required: [true, 'Material composition is required'],
      trim: true
    },
    fit: {
      type: String,
      required: true,
      enum: [
        'Regular Fit',
        'Oversized Fit',
        'Boxy Fit',
        'Drop-Shoulder Fit',
        'Relaxed Fit',
        'Slim Fit',
        'Tailored Fit'
      ],
      index: true
    },
    stock: {
      type: Map,
      of: Number,
      default: {},
      description: 'Stock count mapped per variant key e.g. "BLK_L": 25'
    },
    availability: {
      type: String,
      enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'PRE_ORDER'],
      default: 'IN_STOCK',
      index: true
    },
    productStatus: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound indexes for instantaneous multi-filter catalog queries
clothingProductSchema.index({ category: 1, productStatus: 1, price: 1 });
clothingProductSchema.index({ category: 1, fit: 1, gsm: 1 });

module.exports = mongoose.model('Product', clothingProductSchema);
