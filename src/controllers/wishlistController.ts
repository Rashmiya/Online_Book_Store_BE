/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/interfaces/commonInterface";
import wishlistService from "../services/wishlistService";
import { Types } from "mongoose";

const wishlistController = {
  // Get All Wishlists (Admin)
  getAllWishlists: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { page, perPage, sort, searchTerm }: any = req.query;
      const parsedPage = parseInt(page, 10) || 1;
      const parsedPerPage = parseInt(perPage, 10) || 10;
      const parsedSort = parseInt(sort, 10) || 1;

      const response: ApiResponse<any[]> =
        await wishlistService.getAllWishlists({
          page: parsedPage,
          perPage: parsedPerPage,
          sort: parsedSort,
          searchTerm,
        });

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  // Get Wishlist by User ID
  getWishlistByUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { userId }: any = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required!",
          data: null,
        });
      }

      const response: ApiResponse<any[]> =
        await wishlistService.getWishlistByUser({ _id: userId });

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  // Create Wishlist Item
  createWishlistItem: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { bookId, email, note, reminderDate, userId } = req.body;
      if (!userId || !bookId) {
        return res.status(400).json({
          success: false,
          message: "User ID and Book ID are required!",
          data: null,
        });
      }

      const response: ApiResponse<any> =
        await wishlistService.createWishlistItem({
          bookId,
          email,
          note,
          reminderDate,
          userId,
        });

      return res.status(response.success ? 201 : 400).json(response);
    } catch (error) {
      next(error);
    }
  },

  // Delete Wishlist Item
  deleteWishlistItem: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { wishlistId }: any = req.query;

      if (!wishlistId) {
        return res.status(400).json({
          success: false,
          message: "Wishlist ID is required!",
          data: null,
        });
      }

      const response: ApiResponse<any> =
        await wishlistService.deleteWishlistItem({ _id: wishlistId });

      return res.status(response.success ? 200 : 404).json(response);
    } catch (error) {
      next(error);
    }
  },

  // Update Wishlist Item Status (Optional)
  updateWishlistStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { wishlistId, bookId, email, note, reminderDate, userId } =
        req.body;

      if (!wishlistId) {
        return res.status(400).json({
          success: false,
          message: "Wishlist ID is required!",
          data: null,
        });
      }

      const response: ApiResponse<any> =
        await wishlistService.updateWishlistStatus({
          wishlistId,
          bookId,
          email,
          note,
          reminderDate,
          userId,
        });

      return res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      next(error);
    }
  },

  // Check Wishlist Item Exists
  checkWishlistItem: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { userId, bookId } = req.query;

      if (!userId || !bookId) {
        return res.status(400).json({
          success: false,
          message: "User ID and Book ID are required!",
          data: null,
        });
      }
      const data = {
        userId: new Types.ObjectId(userId as string),
        bookId: new Types.ObjectId(bookId as string),
      };
      const response: ApiResponse<any> =
        await wishlistService.checkWishlistItem(data);

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
};

export default wishlistController;
