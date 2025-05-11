import Order from "../models/order.model";
import Book from "../models/book.model";
import {
  OrderDetails,
  OrderIdInterface,
  SaveOrder,
} from "../utils/interfaces/orderInterface";
import { ObjectId } from "mongoose";
import { bookIdInterface } from "../utils/interfaces/bookInterface";
import Customer from "../models/customer.model";

const OrderRepository = {
  //get All Orders
  getAllOrdersRepo: async (data: OrderDetails): Promise<any> => {
    try {
      const { page, perPage, sort, searchTerm }: any = data;
      let query: any = {};

      if (searchTerm) {
        query = {
          $or: [
            {
              "shippingAddress.address": { $regex: searchTerm, $options: "i" },
            },
            { paymentMethod: { $regex: searchTerm, $options: "i" } },
            { phoneNumber: { $regex: searchTerm, $options: "i" } },
          ],
        };
      }
      let sortCriteria: any = {};
      switch (sort) {
        case 1:
          sortCriteria = { updatedAt: -1 }; // Descending order
          break;
        case 2:
          sortCriteria = { updatedAt: 1 }; // Ascending order
          break;
        default:
          sortCriteria = { updatedAt: -1 }; // Default to descending
          break;
      }
      const skip = (page - 1) * perPage;
      const allOrders = await Order.find(query)
        .sort(sortCriteria)
        .skip(skip)
        .limit(perPage)
        .populate("customer_id", "username email") // optional: show customer details
        .populate("order_details.book_id", "title author price") // populate book info
        .lean();

      const processedOrders = allOrders.map((order: any) => ({
        orderId: order._id,
        customer: order.customer_id, // populated with name, email
        order_details: order.order_details.map((detail: any) => ({
          book: detail.book_id
            ? {
                bookId: detail.book_id._id,
                title: detail.book_id.title,
                author: detail.book_id.author,
                price: detail.book_id.price,
              }
            : null,
          qty: detail.qty,
          price: detail.price,
        })),
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        phoneNumber: order.phoneNumber,
      }));
      const totalCount = await Order.countDocuments(query);
      const totalPages = Math.ceil(totalCount / perPage);
      return {
        success: true,
        message: "Orders Fetched Successfully!",
        data: {
          page,
          totalPages,
          totalCount,
          orders: processedOrders,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  // Get Order By ID
  getOrderByIdRepo: async (orderId: OrderIdInterface): Promise<any> => {
    try {
      const order = await Order.findById(orderId)
        .populate("customer_id", "username email") // optional: show customer details
        .populate("order_details.book_id", "title author price") // populate book info
        .lean();
      if (!order) {
        return {
          success: false,
          message: "Order not found!",
          data: null,
        };
      }

      return {
        success: true,
        message: "Order fetched successfully!",
        data: order,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  //delete Order Repo
  deleteOrderRepo: async (data: OrderIdInterface): Promise<any> => {
    try {
      const order = await Order.findOne({ _id: data?._id }).lean();
      if (!order) {
        return {
          success: false,
          message: "Can Not Fetch Order Data!",
          data: null,
        };
      }
      if (["pending", "processing", "shipped"].includes(order.status)) {
        for (const item of order.order_details || []) {
          const { book_id, qty } = item;
          await Book.findByIdAndUpdate(
            book_id,
            { $inc: { qty: qty } },
            { new: true }
          );
        }
      }
      await Order.findByIdAndDelete({ _id: data?._id });
      return {
        success: true,
        message: "Order Deleted Successfully!",
        data: null,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  // Get User Orders
  getUserOrdersRepo: async (userId: OrderIdInterface): Promise<any> => {
    try {
      const orders = await Order.find({ customer_id: userId })
        .populate("customer_id", "username email") // optional: show customer details
        .populate("order_details.book_id", "title author price") // populate book info
        .lean();

      if (!orders) {
        return {
          success: false,
          message: "Order not found!",
          data: null,
        };
      }
      return {
        success: true,
        message: "Orders fetched successfully!",
        data: orders,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  // Create Order
  createOrderRepo: async (orderData: SaveOrder): Promise<any> => {
    try {
      const order = new Order(orderData);
      const savedOrder = await order.save();

      // Update book quantities
      for (const item of orderData.order_details) {
        await Book.findByIdAndUpdate(
          item.book_id,
          { $inc: { qty: -item.qty } },
          { new: true }
        );
      }

      // Update customer's orderCount
      await Customer.findByIdAndUpdate(
        orderData.customer_id,
        {
          $inc: { orderCount: 1 },
          $set: {
            shippingAddress: orderData.shippingAddress,
            ...(orderData.phoneNumber && {
              mobile_number: orderData.phoneNumber,
            }),
          },
        },
        { new: true }
      );

      return {
        success: true,
        message: "Order created successfully!",
        data: savedOrder,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  // Update Order Status
  updateOrderStatusRepo: async (
    orderId: ObjectId,
    status: any
  ): Promise<any> => {
    try {
      const order = await Order.findById(orderId);

      if (!order) {
        return {
          success: false,
          message: "Order not found!",
          data: null,
        };
      }
      if (status === "cancelled") {
        for (const item of order.order_details || []) {
          const { book_id, qty } = item;
          await Book.findByIdAndUpdate(
            book_id,
            { $inc: { qty: qty } },
            { new: true }
          );
        }
      }
      order.status = status;
      const updatedOrder = await order.save();

      return {
        success: true,
        message: "Order status updated successfully to " + status + "!",
        data: updatedOrder,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  // Update Order payment Status
  updateOrderPaymentStatusRepo: async (
    orderId: ObjectId,
    paymentStatus: any
  ): Promise<any> => {
    try {
      const order = await Order.findById(orderId);

      if (!order) {
        return {
          success: false,
          message: "Order not found!",
          data: null,
        };
      }

      order.paymentStatus = paymentStatus;
      const updatedOrder = await order.save();

      return {
        success: true,
        message: "Order payment status updated successfully!",
        data: updatedOrder,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },
};

export default OrderRepository;
