const mongoose = require('mongoose');
const HotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    city: { type: String, required: true },
    title: { type: String, required: true },
    address: { type: String, required: true },
    distance: { type: String, required: true },
    images: { type: [String] },
    desc: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5 },
    rooms: [{ type: String }],
    cheapestPrice: { type: Number, required: true },
    featured: { type: Boolean, default: false },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hotel', HotelSchema);
