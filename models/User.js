const mongooose = require('mongoose');
const UserSchema = new mongooose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: String, default: 'guest' },
    country: { type: String, required: true },
    img: { type: String },
    city: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongooose.model('User', UserSchema);
