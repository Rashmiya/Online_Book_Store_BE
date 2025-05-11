import { Types } from "mongoose";

export interface BookModel {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  author: string;
  ISBN_number: string;
  price: number;
  type: string;
  cover_image: string;
  status: number;
  publisher: string;
  pub_year: string;
  qty: number;
}
export interface BookDetails {
  page?: number;
  perPage?: number;
  sort?: number;
  bookName?: string | undefined;
  ISBN_number: string | undefined;
  searchTerm?: string | undefined;
  defaultFilter?: string | undefined;
  popularAuthors?: string | undefined;
  priceMin?: number | undefined;
  priceMax?: number | undefined;
  availability?: boolean | undefined;
  types?: string | undefined;
}

export interface BookReviews {
  bookId?: Types.ObjectId | undefined;
  userName: string | undefined;
  comment: string | undefined;
  rating: number | undefined;
}
export interface saveBook {
  _id?: Types.ObjectId | undefined;
  title: string;
  author: string;
  ISBN_number: string;
  price: number;
  status: number;
  qty: number;
  description?: string;
  types?: string[];
  cover_images?: string[];
  pdf_file?: string;
  publisher?: string;
  pub_year?: string;
  isAwarded?: boolean;
  rating?: number;
  number_of_pages?: number;
  format?: "PDF" | "PAPER" | "BOTH";
  reviews?: BookReviews[];
  createdAt?: Date;
  updatedAt?: Date;
  old_images?: string[];
}

export interface bookIdInterface {
  _id?: Types.ObjectId;
}
