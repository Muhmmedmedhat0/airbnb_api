const mongooose = require('mongoose');
const UserSchema = new mongooose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: String, default: 'guest' },
    country: { type: String },
    img: { type: String },
    city: { type: String },
    phone: { type: String },
    wishlist: [{ type: mongooose.Schema.Types.ObjectId, ref: 'Hotel' }],
    reservation: [{ type: mongooose.Schema.Types.ObjectId, ref: 'Hotel' }],
  },
  { timestamps: true }
);

module.exports = mongooose.model('User', UserSchema);
