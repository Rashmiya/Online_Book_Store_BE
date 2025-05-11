import { Types } from "mongoose";

export interface OrderModel {
  _id: Types.ObjectId;
  oid: number;
  customer_name: string;

  itemList: {
    book_name: string;
    quantity: number;
    price: number;
  }[];

  totalAmount: number;
  shippingAddress: string;
  orderDate: Date;
}

export interface OrderDetails {
  page?: number;
  perPage?: number;
  sort?: number;
  searchTerm?: string | undefined;
}

export interface OrderIdInterface {
  _id?: Types.ObjectId;
}

export interface OrderEmailInterface {
  email: string;
}

export interface OrderDetail {
  book_id: Types.ObjectId | string; // string for input, ObjectId for DB
  qty: number;
  price: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}
export interface SaveOrder {
  customer_id: Types.ObjectId | string;
  order_details: OrderDetail[];
  totalAmount: number;
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled"; // optional for create (defaults to pending)
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus?: "pending" | "completed" | "failed" | "refunded"; // optional (defaults to pending)
  phoneNumber: string;
}
