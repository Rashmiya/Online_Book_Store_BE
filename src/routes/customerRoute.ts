import express from "express";
import CustomerController from "../controllers/customerController";
import { permissions } from "../middleware/checkAuth";
const route = express.Router();
route.get("/all", permissions, CustomerController?.getAllCustomer);
route.post("/signup", CustomerController?.saveCustomer);
route.post("/signin", CustomerController?.loginCustomer);
route.get("/logout", CustomerController?.logout);
route.post("/refresh", CustomerController?.refresh);
route.get("/details", CustomerController?.userDetail);
route.put("/update", permissions, CustomerController?.userDetailUpdate);
route.delete("/delete", permissions, CustomerController?.deleteCustomer);

export default route;
