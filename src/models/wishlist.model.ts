// import mongoose from "mongoose";

// const wishlistSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Customer",
//     required: true,
//   },
//   bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
//   note: { type: String },
//   email: { type: String },
//   reminderDate: { type: Date },
//   createdAt: { type: Date, default: Date.now },
// });

// const Wishlist = mongoose.model("Wishlist", wishlistSchema);
// export default Wishlist;
import mongoose, { Document } from "mongoose";

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId | { title: string }; // Update this
  note?: string;
  email?: string;
  reminderDate?: Date;
  createdAt?: Date;
}

const wishlistSchema = new mongoose.Schema<IWishlist>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  note: { type: String },
  email: { type: String },
  reminderDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Wishlist = mongoose.model<IWishlist>("Wishlist", wishlistSchema);
export default Wishlist;
