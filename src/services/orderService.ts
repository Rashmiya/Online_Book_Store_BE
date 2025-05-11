// import Order from '../models/order.model';
// import { OrderModel } from '../utils/interface';

import { ObjectId } from "mongoose";
import OrderRepository from "../repositories/OrderRepository";
import { ApiResponse } from "../utils/interfaces/commonInterface";
import {
  OrderDetails,
  OrderIdInterface,
  SaveOrder,
} from "../utils/interfaces/orderInterface";

const orderService = {
  getAllBookService: async (orderData: OrderDetails) => {
    return await OrderRepository.getAllOrdersRepo(orderData);
  },

  getOrderByIdService: async (orderId: OrderIdInterface) => {
    return await OrderRepository.getOrderByIdRepo(orderId);
  },

  deleteOrderService: async (orderId: OrderIdInterface) => {
    return await OrderRepository.deleteOrderRepo(orderId);
  },

  getUserOrdersService: async (userId: OrderIdInterface) => {
    return await OrderRepository.getUserOrdersRepo(userId);
  },

  createOrderService: async (orderData: SaveOrder) => {
     return await OrderRepository.createOrderRepo(orderData);
  },

  updateOrderStatusService: async (orderId: ObjectId, status: string) => {
    return await OrderRepository.updateOrderStatusRepo(orderId, status);
  },

  updateOrderPaymentStatusService: async (
    orderId: ObjectId,
    status: string
  ) => {
    return await OrderRepository.updateOrderPaymentStatusRepo(orderId, status);
  },
};

export default orderService;
