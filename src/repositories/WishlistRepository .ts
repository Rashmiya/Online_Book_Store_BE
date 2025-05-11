import Wishlist from "../models/wishlist.model";
import Book from "../models/book.model";
import Customer from "../models/customer.model";
import {
  SaveWishlist,
  WishlistCheckInterface,
  WishlistDetails,
  WishlistIdInterface,
} from "../utils/interfaces/wishlistInterface";

const WishlistRepository = {
  getAllWishlists: async (data: WishlistDetails): Promise<any> => {
    try {
      const { page, perPage, sort, searchTerm }: any = data;
      let query: any = {};

      if (searchTerm) {
        query = {
          $or: [
            { note: { $regex: searchTerm, $options: "i" } },
            { "bookId.title": { $regex: searchTerm, $options: "i" } },
          ],
        };
      }

      let sortCriteria: any = {};
      switch (sort) {
        case 1:
          sortCriteria = { createdAt: -1 };
          break;
        case 2:
          sortCriteria = { createdAt: 1 };
          break;
        default:
          sortCriteria = { createdAt: -1 };
          break;
      }

      const skip = (page - 1) * perPage;

      const wishlists = await Wishlist.find(query)
        .populate("userId", "username email")
        .populate("bookId", "title author price")
        .sort(sortCriteria)
        .skip(skip)
        .limit(perPage)
        .lean();

      const processedWishlists = wishlists.map((item: any) => ({
        wishlistId: item._id,
        user: item.userId,
        book: item.bookId,
        note: item.note,
        reminderDate: item.reminderDate,
        createdAt: item.createdAt,
      }));

      const totalCount = await Wishlist.countDocuments(query);
      const totalPages = Math.ceil(totalCount / perPage);

      return {
        success: true,
        message: "Wishlists fetched successfully!",
        data: {
          page,
          totalPages,
          totalCount,
          wishlists: processedWishlists,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
        data: null,
      };
    }
  },

  getWishlistByUser: async ({
    _id: userId,
  }: WishlistIdInterface): Promise<any> => {
    try {
      const wishlists = await Wishlist.find({ userId })
        .populate("bookId", "title author price")
        .lean();

      return {
        success: true,
        message: "Wishlist items fetched successfully!",
        data: wishlists,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
        data: null,
      };
    }
  },

  createWishlistItem: async (data: SaveWishlist): Promise<any> => {
    try {
      const bookExists = await Book.findById(data.bookId);
      if (!bookExists) {
        return {
          success: false,
          message: "Book not found!",
          data: null,
        };
      }

      // Check if customer (user) exists
      const customerExists = await Customer.findById(data.userId);
      if (!customerExists) {
        return {
          success: false,
          message: "Customer not found!",
          data: null,
        };
      }
      const newWishlist = new Wishlist(data);
      const saved = await newWishlist.save();

      return {
        success: true,
        message: "Wishlist item created successfully!",
        data: saved,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
        data: null,
      };
    }
  },

  deleteWishlistItem: async ({
    _id: wishlistId,
  }: WishlistIdInterface): Promise<any> => {
    try {
      const deleted = await Wishlist.findByIdAndDelete(wishlistId);
      if (!deleted) {
        return {
          success: false,
          message: "Wishlist item not found!",
          data: null,
        };
      }

      return {
        success: true,
        message: "Wishlist item deleted successfully!",
        data: deleted,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
        data: null,
      };
    }
  },

  updateWishlistStatus: async (data: SaveWishlist): Promise<any> => {
    try {
      const existWishlist = await Wishlist.findById(data?.wishlistId);
      if (!existWishlist) {
        return {
          success: false,
          message: "Wishlist not found!",
          data: null,
        };
      }

      const updated = await Wishlist.findByIdAndUpdate(data.wishlistId,data, {
        new: true,
      });

      if (!updated) {
        return {
          success: false,
          message: "Wishlist item not found!",
          data: null,
        };
      }

      return {
        success: true,
        message: "Wishlist status updated successfully!",
        data: updated,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
        data: null,
      };
    }
  },

  checkWishlistItem: async (data: WishlistCheckInterface): Promise<any> => {
    try {
      const exists = await Wishlist.findOne(data).lean();

      return {
        success: true,
        message: exists ? "Item exists in wishlist." : "Item not in wishlist.",
        data: exists,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
        data: null,
      };
    }
  },
};

export default WishlistRepository;
