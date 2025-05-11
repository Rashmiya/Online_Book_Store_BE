/* eslint-disable @typescript-eslint/no-explicit-any */
import { uploadToAzureBlob } from "../config/azureBlob";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/interfaces/commonInterface";
import BookService from "../services/bookService";

const BookController = {
  getAllBook: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const {
      page,
      perPage,
      sort,
      bookName,
      ISBN_number,
      searchTerm,
      defaultFilter,
      popularAuthors,
      priceMin,
      priceMax,
      availability,
      types,
    }: any = req.query;
    try {
      const parsedPage = parseInt(page, 10) || 1;
      const parsedPerPage = parseInt(perPage, 10) || 10;
      const parsedSort = parseInt(sort) || 1;
      const response: ApiResponse<any[]> = await BookService?.getAllBookService(
        {
          page: parsedPage,
          perPage: parsedPerPage,
          sort: parsedSort,
          bookName,
          ISBN_number,
          searchTerm,
          defaultFilter,
          popularAuthors,
          priceMin,
          priceMax,
          availability,
          types,
        }
      );
      return res.status(200).json({
        success: response?.success,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  },

  saveBook: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      let pdfFile = (req.files as { [key: string]: Express.Multer.File[] })
        ?.pdf_file?.[0];
      let coverImages =
        (req.files as { [key: string]: Express.Multer.File[] })?.cover_images ||
        [];

      let uploadedPdfUrl = "";
      if (pdfFile) {
        uploadedPdfUrl = await uploadToAzureBlob(
          pdfFile.buffer,
          pdfFile.originalname,
          pdfFile.mimetype
        ); 
      }

      const uploadedImageUrls: string[] = [];
      for (const image of coverImages) {
        const imageUrl = await uploadToAzureBlob(
          image.buffer,
          image.originalname,
          image.mimetype
        );
        uploadedImageUrls.push(imageUrl); 
      }
      const {
        title,
        description,
        author,
        ISBN_number,
        price,
        status,
        publisher,
        pub_year,
        qty,
        isAwarded,
        rating,
        number_of_pages,
        format,
        reviews,
        types,
      } = req?.body;

      if (!title) {
        return res.status(200).json({
          success: false,
          message: "Book Name Required!",
          data: null,
        });
      }

      if (!author) {
        return res.status(200).json({
          success: false,
          message: "Author Required!",
          data: null,
        });
      }

      if (!ISBN_number) {
        return res.status(200).json({
          success: false,
          message: "ISBN Number Required!",
          data: null,
        });
      }

      if (!price) {
        return res.status(200).json({
          success: false,
          message: "Price Required!",
          data: null,
        });
      }

      if (!status) {
        return res.status(200).json({
          success: false,
          message: "Status Required!",
          data: null,
        });
      }

      if (!qty) {
        return res.status(200).json({
          success: false,
          message: "Quantity Required!",
          data: null,
        });
      }

      // Get files from request if they exist
      coverImages = (req as any).files?.["cover_images"] || [];
      pdfFile = (req as any).files?.["pdf_file"]?.[0] || null;
      let defaultReviews: never[] = [];
      const response: ApiResponse<any[]> = await BookService?.saveBookService({
        title: title.trim(),
        description,
        author,
        ISBN_number,
        price,
        types,
        cover_images: uploadedImageUrls,
        status,
        publisher,
        pub_year,
        qty: parseInt(qty.toString()),
        pdf_file: uploadedPdfUrl,
        isAwarded: isAwarded ? isAwarded : false,
        rating,
        number_of_pages,
        format,
        reviews: defaultReviews,
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

  updateBook: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const {
        bookId,
        title,
        description,
        author,
        ISBN_number,
        price,
        status,
        publisher,
        pub_year,
        qty,
        isAwarded,
        rating,
        number_of_pages,
        format,
        reviews,
        types,
        old_images,
        old_pdf_file,
      } = req?.body;
      if (!title || !bookId) {
        return res.status(200).json({
          success: false,
          message: "Book ID & Book Name Required!",
          data: null,
        });
      }

      // Get files from request if they exist
      let coverImages = (req as any).files?.["cover_images"] || [];
      let pdfFile = (req as any).files?.["pdf_file"]?.[0] || null;

      // Upload PDF if new one is provided
      let uploadedPdfUrl: string | undefined;
      if (pdfFile) {
        uploadedPdfUrl = await uploadToAzureBlob(
          pdfFile.buffer,
          pdfFile.originalname,
          pdfFile.mimetype
        );
      }

      // Upload new images if provided
      const uploadedImageUrls: string[] = [];
      for (const image of coverImages) {
        const imageUrl = await uploadToAzureBlob(
          image.buffer,
          image.originalname,
          image.mimetype
        );
        uploadedImageUrls.push(imageUrl);
      }
      const finalCoverImages = [...old_images, ...uploadedImageUrls];

      const response: ApiResponse<any[]> = await BookService?.updateBookService(
        {
          _id: bookId,
          title: title.trim(),
          description,
          author,
          ISBN_number,
          price,
          types,
          cover_images: finalCoverImages,
          status,
          publisher,
          pub_year,
          qty: parseInt(qty.toString()),
          pdf_file: uploadedPdfUrl ?? old_pdf_file,
          isAwarded: isAwarded ? isAwarded : false,
          rating,
          number_of_pages,
          format,
          reviews: [],
        }
      );
      return res.status(200).json({
        success: response?.success,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  },

  fetchBook: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { bookId }: any = req?.query;

      if (!bookId) {
        return res.status(200).json({
          success: false,
          message: "Book ID Required!",
          data: null,
        });
      }
      const response: ApiResponse<any[]> = await BookService?.fetchBookService({
        _id: bookId,
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

  deleteBook: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { bookId }: any = req?.query;

      if (!bookId) {
        return res.status(200).json({
          success: false,
          message: "Book ID Required!",
          data: null,
        });
      }
      const response: ApiResponse<any[]> = await BookService?.deleteBookService(
        {
          _id: bookId,
        }
      );
      return res.status(200).json({
        success: response?.success,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  },

  addReview: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const review = req.body;

      if (!review) {
        return res.status(200).json({
          success: false,
          message: "Book ID and review are required!",
          data: null,
        });
      }

      const response = await BookService.saveBookReviewService(review);

      return res.status(200).json({
        success: response?.success,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  },

  searchByImage: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const imageFile = req.file; 
      if (!imageFile)
        return res.status(400).json({ message: "No image uploaded" });

      const response = await BookService.searchBooksByImage(imageFile.buffer);

      return res.status(200).json({
        success: response?.success,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default BookController;
