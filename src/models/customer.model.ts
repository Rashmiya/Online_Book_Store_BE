import mongoose, { Schema } from "mongoose";
const customerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: false,
    },
    mobile_number: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    shippingAddress: {
      address: { type: String, required: false },
      city: { type: String, required: false },
      postalCode: { type: String, required: false },
      country: { type: String, required: false },
    },
    orderCount: {
      type: Number,
      required: false,
      default: 0,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      required: true,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);
const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
