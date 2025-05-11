import express from "express";
import orderController from "../controllers/orderController";
import { permissions } from "../middleware/checkAuth";
const route = express.Router();
route.get("/all", permissions, orderController?.getAllOrders);
route.get("/find", permissions, orderController?.getOrderById);
route.delete("/delete", permissions, orderController?.deleteOrder);
route.get("/user-orders", permissions, orderController?.getUserOrders);
route.put("/update-status", permissions, orderController?.updateOrderStatus);
route.put("/update-payment", permissions, orderController?.updatePaymentStatus);
route.post("/create", permissions, orderController?.createOrder);

export default route;
