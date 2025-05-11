/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/interfaces/commonInterface";
import orderService from "../services/orderService";
import { ObjectId } from "mongoose";
import BookService from "../services/bookService";
import { OrderDetail, SaveOrder } from "../utils/interfaces/orderInterface";

const orderController = {
  // Get All Orders (Admin)
  getAllOrders: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { page, perPage, sort, searchTerm }: any = req.query;
      const parsedPage = parseInt(page, 10) || 1;
      const parsedPerPage = parseInt(perPage, 10) || 10;
      const parsedSort = parseInt(sort) || 1;

      const response: ApiResponse<any[]> =
        await orderService?.getAllBookService({
          page: parsedPage,
          perPage: parsedPerPage,
          sort: parsedSort,
          searchTerm,
        });
      return res.status(200).json({
        success: response?.success,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get Order Details
  getOrderById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { orderId }: any = req?.query;

      if (!orderId) {
        return res.status(200).json({
          success: false,
          message: "Order ID Required!",
          data: null,
        });
      }
      const response: ApiResponse<any[]> =
        await orderService?.getOrderByIdService({
          _id: orderId,
        });
      return res.status(200).json({
        success: response?.success,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  },

  //delete order
  deleteOrder: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { orderId }: any = req?.query;

      if (!orderId) {
        return res.status(200).json({
          success: false,
          message: "Order ID Required!",
          data: null,
        });
      }
      const response: ApiResponse<any[]> =
        await orderService?.deleteOrderService({
          _id: orderId,
        });
      return res.status(200).json({
        success: response?.success,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get User Orders
  getUserOrders: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { userId }: any = req?.query;

      if (!userId) {
        return res.status(200).json({
          success: false,
          message: "User ID Required!",
          data: null,
        });
      }
      const response: ApiResponse<any[]> =
        await orderService?.getUserOrdersService({
          _id: userId,
        });
      return res.status(200).json({
        success: response?.success,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  },

  //create order
  createOrder: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const {
        customer_id,
        order_details,
        shippingAddress,
        paymentMethod,
        phoneNumber,
      } = req.body;

      if (!Array.isArray(order_details) || order_details.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No books in order!",
          data: null,
        });
      }

      if (!shippingAddress) {
        return res.status(400).json({
          success: false,
          message: "Shipping address required!",
          data: null,
        });
      }

      if (!paymentMethod) {
        return res.status(400).json({
          success: false,
          message: "Payment method required!",
          data: null,
        });
      }

      if (!phoneNumber) {
        return res.status(400).json({
          success: false,
          message: "Phone Number is required!",
          data: null,
        });
      }
      let totalAmount = 0;
      const orderItems: OrderDetail[] = [];
      const SHIPPING_FEE = 1000;
      for (const item of order_details) {
        const response = await BookService?.fetchBookService({
          _id: item.book_id,
        });
        const book: any = response.data;

        if (!book) {
          return res.status(404).json({
            success: false,
            message: `Book not found with ID: ${item.bookId}`,
            data: null,
          });
        }

        if (book.qty < item.qty) {
          return res.status(400).json({
            success: false,
            message: `Only ${book.qty} copies of "${book.title}" available!`,
            data: null,
          });
        }

        totalAmount += book.price * item.qty;

        orderItems.push({
          book_id: item.book_id,
          qty: item.qty,
          price: book.price,
        });
      }

      const orderData: SaveOrder = {
        customer_id,
        order_details: orderItems,
        totalAmount: totalAmount + SHIPPING_FEE,
        shippingAddress,
        paymentMethod,
        phoneNumber,
        status: "pending",
        paymentStatus: "pending",
      };

      const response = await orderService.createOrderService(orderData);

      return res.status(response.success ? 201 : 400).json({
        success: response.success,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  },
  
  // Update Order Status (Admin)
  updateOrderStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { orderId, status }: any = req.body;
      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required!",
          data: null,
        });
      }

      const validStatuses = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value!",
          data: null,
        });
      }

      const response = await orderService.updateOrderStatusService(
        orderId,
        status
      );

      return res.status(response.success ? 200 : 404).json({
        success: response.success,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  },

  // Update Payment Status (Admin)
  updatePaymentStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { orderId, paymentStatus } = req.body;

      if (!paymentStatus) {
        return res.status(400).json({
          success: false,
          message: "Payment status is required!",
          data: null,
        });
      }

      const validStatuses = ["pending", "completed", "failed", "refunded"];
      if (!validStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment status value!",
          data: null,
        });
      }

      const response = await orderService.updateOrderPaymentStatusService(
        orderId,
        paymentStatus
      );

      return res.status(response.success ? 200 : 404).json({
        success: response.success,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default orderController;
