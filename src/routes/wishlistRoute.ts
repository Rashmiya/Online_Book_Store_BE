import express from "express";
import { permissions } from "../middleware/checkAuth";
import wishlistController from "../controllers/wishlistController";
const route = express.Router();
route.get("/all", permissions, wishlistController?.getAllWishlists);
route.post("/create", permissions, wishlistController?.createWishlistItem);
route.put("/update", permissions, wishlistController?.updateWishlistStatus);
route.delete("/delete", permissions, wishlistController?.deleteWishlistItem);
route.get("/find-by-user", permissions, wishlistController?.getWishlistByUser);
route.get("/check", permissions, wishlistController?.checkWishlistItem);

export default route;
