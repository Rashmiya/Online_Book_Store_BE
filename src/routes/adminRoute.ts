import express from "express";
import adminController from "../controllers/adminController";
import { permissions } from "../middleware/checkAuth";
const route = express.Router();
route.get("/all", permissions, adminController?.getAllAdmins);
route.post("/signup", adminController?.saveAdmin);
route.post("/signin", adminController?.loginAdmin);
route.get("/logout", adminController?.logout);
route.post("/refresh", adminController?.refresh);
route.delete("/delete", permissions, adminController?.deleteAdmin);

export default route;
