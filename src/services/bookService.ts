import { Types } from "mongoose";
import { uploadToAzureBlob } from "../config/azureBlob";
import { uploadFileToCloudinary } from "../config/script";
import BookRepository from "../repositories/BookRepository";
import {
  BookDetails,
  bookIdInterface,
  BookModel,
  BookReviews,
  saveBook,
} from "../utils/interfaces/bookInterface";
import { ApiResponse } from "../utils/interfaces/commonInterface";
import pythonMicroservice from "./pythonMicroservice";

const BookService = {
  getAllBookService: async (data: BookDetails): Promise<ApiResponse<any[]>> => {
    try {
      return BookRepository.getAllBookRepo(data);
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  saveBookService: async (data: saveBook): Promise<ApiResponse<any[]>> => {
    try {
      const bookData: any = {
        title: data.title,
        description: data.description,
        author: data.author,
        ISBN_number: data.ISBN_number,
        price:
          typeof data.price === "string" ? parseFloat(data.price) : data.price,
        types: data.types || [],
        status:
          typeof data.status === "string" ? parseInt(data.status) : data.status,
        publisher: data.publisher,
        pub_year: data.pub_year,
        qty: data.qty,
        isAwarded: data.isAwarded,
        rating: data.rating,
        number_of_pages: data.number_of_pages,
        format: data.format,
        reviews: data.reviews,
        cover_images: [], // Will store URLs
        pdf_file: null, // Will store URL
        type: data.types,
      };

      // Handle cover images uploads (if any)
      // if (data.cover_images && data.cover_images.length > 0) {
      //   const imageUploadPromises = data.cover_images.map((image) =>
      //     //uploadFileToCloudinary(image, "books/covers")
      //     uploadToAzureBlob(image.buffer, image.originalname, image.mimetype)
      //   );

      //   const imageUrls = await Promise.all(imageUploadPromises);

      //   // Filter out any null results
      //   bookData.cover_images = imageUrls.filter((url) => url !== null);
      // }
      bookData.cover_images = data.cover_images || [];
      bookData.pdf_file = data.pdf_file || "";

      // Handle PDF file upload (if any)
      // if (data.pdf_file) {
      //   const pdfUrl = await uploadFileToCloudinary(
      //     data.pdf_file,
      //     "books/files"
      //   );
      //   if (pdfUrl) {
      //     bookData.pdf_file = pdfUrl;
      //   }
      // }

      // Save the book data with file URLs to the database using the repository
      const result = await BookRepository.saveBookRepo(bookData);

      return {
        success: result.success,
        message:
          result.message ||
          (result.success ? "Book saved successfully" : "Failed to save book"),
        data: result.data,
      };
    } catch (error: any) {
      console.error("Error in saveBookService:", error);
      return {
        success: false,
        message: error.message || "An error occurred while saving the book",
        data: null,
      };
    }
  },

  updateBookService: async (data: saveBook): Promise<ApiResponse<any[]>> => {
    try {
      const bookData: any = {
        _id: data._id,
        title: data.title,
        description: data.description,
        author: data.author,
        ISBN_number: data.ISBN_number,
        price:
          typeof data.price === "string" ? parseFloat(data.price) : data.price,
        types: data.types || [],
        status:
          typeof data.status === "string" ? parseInt(data.status) : data.status,
        publisher: data.publisher,
        pub_year: data.pub_year,
        qty: data.qty,
        isAwarded: data.isAwarded,
        rating: data.rating,
        number_of_pages: data.number_of_pages,
        format: data.format,
        reviews: data.reviews,
        cover_images: data.cover_images || [],
        pdf_file: data.pdf_file || null,
        type: data.types,
      };

      const finalCoverImages = [
        ...(data.old_images || []),
        ...(data.cover_images || []),
      ];
      bookData.cover_images = finalCoverImages;

      bookData.pdf_file = data.pdf_file || null;

      const result = await BookRepository.updateBookRepo(bookData);

      return {
        success: result.success,
        message:
          result.message ||
          (result.success
            ? "Book updated successfully"
            : "Failed to update book"),
        data: result.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  fetchBookService: async (
    data: bookIdInterface
  ): Promise<ApiResponse<any[]>> => {
    try {
      return await BookRepository.fetchBookRepo(data);
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  deleteBookService: async (
    data: bookIdInterface
  ): Promise<ApiResponse<any[]>> => {
    try {
      return await BookRepository.deleteBookRepo(data);
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  saveBookReviewService: async (
    review: BookReviews
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await BookRepository.addReviewRepo(review);

      return {
        success: result.success,
        message: result.message,
        data: result.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  searchBooksByImage: async (imageBuffer: Buffer) => {
    try { 
      const bookIds = await pythonMicroservice.getMatchedBookIds(imageBuffer); 
      const objectIds = bookIds.map((id) => new Types.ObjectId(id));

      const result = await BookRepository.fetchBookRepoByImage({
        _id: { $in: objectIds },
      });
      return {
        success: result.success,
        message: result.message,
        data: result.data,
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
export default BookService;
