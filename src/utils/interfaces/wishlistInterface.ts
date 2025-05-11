import { Types } from "mongoose";

export interface WishlistDetails {
  page?: number;
  perPage?: number;
  sort?: number;
  searchTerm?: string | undefined;
}
export interface WishlistIdInterface {
  _id?: Types.ObjectId;
}
export interface SaveWishlist {
  wishlistId?: Types.ObjectId;
  bookId: Types.ObjectId;
  email: string | undefined;
  note: string | undefined;
  reminderDate: Date;
  userId: Types.ObjectId;
}

export interface WishlistCheckInterface {
  bookId?: Types.ObjectId;
  userId?: Types.ObjectId;
}
