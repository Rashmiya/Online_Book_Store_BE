import mongoose from "mongoose";
const reviews = new mongoose.Schema({
  userName: {
    type: String,
  },
  comment: {
    type: String,
  },
  rating: {
    type: Number,
  },
});
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    ISBN_number: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    types: {
      type: [String],
    },
    cover_images: {
      type: [String],
    },
    pdf_file: {
      type: String,
    },
    publisher: {
      type: String,
    },
    pub_year: {
      type: String,
    },
    isAwarded: {
      type: Boolean,
    },
    rating: {
      type: Number,
    },
    number_of_pages: {
      type: Number,
    },
    format: {
      type: String,
    },
    reviews: {
      type: [reviews],
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);
const Book = mongoose.model("Book", bookSchema);
export default Book;
