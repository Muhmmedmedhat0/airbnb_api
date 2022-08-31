const mongooose = require("mongoose");
const UserSchema = new mongooose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: String, default: "guest" },
    country: { type: String },
    img: { type: String },
    city: { type: String },
    phone: { type: String },
    hotels: [{ type: mongooose.Schema.Types.ObjectId, ref: "Hotel" }],
    reservations: [{ type: mongooose.Schema.Types.ObjectId, ref: "Hotel" }],
    wishlist: [{ type: mongooose.Schema.Types.ObjectId, ref: "Hotel" }],
  },
  { timestamps: true }
);

module.exports = mongooose.model("User", UserSchema);
