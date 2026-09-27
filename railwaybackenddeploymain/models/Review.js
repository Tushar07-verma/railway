/**
 * T-RAYO Product Review & Fit Feedback Model
 */
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    fitFeedback: {
      type: String,
      enum: ['Runs Small', 'True to Size', 'Runs Large'],
      default: 'True to Size'
    },
    comment: { type: String, required: true, trim: true },
    isVerifiedBuyer: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
