import WishlistRepository from "../repositories/WishlistRepository ";
import {
  SaveWishlist,
  WishlistCheckInterface,
  WishlistDetails,
  WishlistIdInterface,
} from "../utils/interfaces/wishlistInterface";

const wishlistService = {
  getAllWishlists: async (query: WishlistDetails) => {
    return await WishlistRepository.getAllWishlists(query);
  },

  getWishlistByUser: async (userId: WishlistIdInterface) => {
    return await WishlistRepository.getWishlistByUser(userId);
  },

  createWishlistItem: async (data: SaveWishlist) => {
    return await WishlistRepository.createWishlistItem(data);
  },

  deleteWishlistItem: async (wishlistId: WishlistIdInterface) => {
    return await WishlistRepository.deleteWishlistItem(wishlistId);
  },

  updateWishlistStatus: async (data: SaveWishlist) => {
    return await WishlistRepository.updateWishlistStatus(data);
  },

  checkWishlistItem: async (data: WishlistCheckInterface) => {
    return await WishlistRepository.checkWishlistItem(data);
  },
};

export default wishlistService;
