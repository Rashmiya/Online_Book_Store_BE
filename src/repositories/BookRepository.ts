import Book from "../models/book.model";
import {
  BookDetails,
  bookIdInterface,
  BookModel,
  BookReviews,
  saveBook,
} from "../utils/interfaces/bookInterface";

const BookRepository = {
  getAllBookRepo: async (data: BookDetails): Promise<any> => {
    try {
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
      }: any = data;
      let query: any = {};

      //search filter
      if (searchTerm) {
        query = {
          $or: [
            { title: { $regex: searchTerm, $options: "i" } },
            { ISBN_number: { $regex: searchTerm, $options: "i" } },
          ],
        };
      } else {
        if (bookName) {
          query.title = { $regex: bookName, $options: "i" };
        }
        if (ISBN_number) {
          query.ISBN_number = ISBN_number;
        }
      }
      //sort filters
      let sortCriteria: any = {};
      switch (sort) {
        case 1:
          sortCriteria = { updatedAt: -1 }; // Descending order
          break;
        case 2:
          sortCriteria = { updatedAt: 1 }; // Ascending order
          break;
        default:
          sortCriteria = { updatedAt: -1 }; // Default to descending
          break;
      }

      // 🎯 Specific filters
      if (popularAuthors?.length) query.author = { $in: popularAuthors };
      if (priceMin !== undefined || priceMax !== undefined) {
        query.price = {};
        if (priceMin !== undefined) query.price.$gte = priceMin;
        if (priceMax !== undefined) query.price.$lte = priceMax;
      }
      if (availability !== undefined) {
        if (availability) {
          query.qty = { $gt: 0 }; // In stock
        } else {
          query.qty = { $lte: 0 }; // Out of stock or none
        }
      }
      if (types?.length) query.types = { $in: types };

      switch (defaultFilter) {
        case "newRelease":
          {
            const currentYear = new Date().getFullYear();
            query.pub_year = String(currentYear);
          }
          break;
        case "isAwarded":
          {
            query.isAwarded = true;
          }
          break;
        case "bestSelling":
          {
            query.qty = { $gte: 100 };
          }
          break;
        case "comingSoon":
          {
            const currentYear = new Date().getFullYear();
            query.pub_year = { $gt: String(currentYear) };
          }
          break;
        default:
          sortCriteria = { createdAt: -1 }; // Default to descending
      }
      const skip = (page - 1) * perPage;
      const allBooks = await Book.find(query)
        .sort(sortCriteria)
        .skip(skip)
        .limit(perPage)
        .lean();

      if (!allBooks) {
        return {
          success: true,
          message: "No Books To Fetch!",
          data: [],
        };
      }

      const processBooks = async (allBooks: any) =>
        Promise.all(
          allBooks.map(async (book: any) => ({
            bookId: book?._id,
            title: book?.title,
            description: book?.description,
            author: book?.author,
            ISBN_number: book?.ISBN_number,
            price: book?.price,
            status: book?.status,
            qty: book?.qty,
            types: book?.types,
            cover_images: book?.cover_images,
            pdf_file: book?.pdf_file,
            publisher: book?.publisher,
            pub_year: book?.pub_year,
            isAwarded: book?.isAwarded,
            rating: book?.rating,
            number_of_pages: book?.number_of_pages,
            format: book?.format,
            reviews: book?.reviews,
            createdAt: book?.createdAt,
            updatedAt: book?.updatedAt,
          }))
        );

      const processedBooks = await processBooks(allBooks);
      const totalCount = await Book.countDocuments(query);
      const totalPages = Math.ceil(totalCount / perPage);
      return {
        success: true,
        message: "Books Fetched Successfully!",
        data: {
          page,
          totalPages,
          totalCount,
          books: processedBooks,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  saveBookRepo: async (data: saveBook): Promise<any> => {
    try {
      const existBookByTitle = await Book.findOne({
        title: {
          $regex: new RegExp("^" + data.title + "$", "i"),
        },
      }).select("title");

      const existBookByISBN = await Book.findOne({
        ISBN_number: data.ISBN_number,
      }).select("ISBN_number");

      if (existBookByTitle) {
        return {
          success: false,
          message: "Book with this title already exists!",
          data: null,
        };
      }

      if (existBookByISBN) {
        return {
          success: false,
          message: "Book with this ISBN number already exists!",
          data: null,
        };
      }

      const book = new Book(data);
      await book.save();
      return {
        success: true,
        message: "Book Added Successfully!",
        data: null,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  updateBookRepo: async (data: saveBook): Promise<any> => {
    try {
      const existBookByTitle = await Book.findOne({
        _id: { $ne: data._id }, // Exclude current book
        title: { $regex: new RegExp(`^${data.title}$`, "i") }, // Case-insensitive match
      });

      // Check if a book with the same ISBN number exists (excluding the current book)
      const existBookByISBN = await Book.findOne({
        ISBN_number: data.ISBN_number,
        _id: { $ne: data._id }, // Exclude current book
      }).select("ISBN_number");

      if (existBookByTitle) {
        return {
          success: false,
          message: "Book with this title already exists!",
          data: null,
        };
      }

      if (existBookByISBN) {
        return {
          success: false,
          message: "Book with this ISBN number already exists!",
          data: null,
        };
      }
      const updatedBook = await Book.findOneAndUpdate({ _id: data?._id }, data);
      if (!updatedBook) {
        return {
          success: false,
          message: "Book Not Found Or Could Not Be Updated!",
          data: null,
        };
      }
      return {
        success: true,
        message: "Book Updated Successfully!",
        data: null,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  fetchBookRepo: async (data: bookIdInterface): Promise<any> => {
    try {
      const book = await Book.findOne({ _id: data?._id }).lean();
      if (!book) {
        return {
          success: false,
          message: "Can Not Fetch Book Data!",
          data: null,
        };
      }
      const typedBook = book as saveBook;

      const finalData = {
        bookId: typedBook._id,
        title: typedBook.title,
        description: typedBook.description,
        author: typedBook.author,
        ISBN_number: typedBook.ISBN_number,
        price: typedBook.price,
        status: typedBook.status,
        qty: typedBook.qty,
        types: typedBook.types,
        cover_images: typedBook.cover_images,
        pdf_file: typedBook.pdf_file,
        publisher: typedBook.publisher,
        pub_year: typedBook.pub_year,
        isAwarded: typedBook.isAwarded,
        rating: typedBook.rating,
        number_of_pages: typedBook.number_of_pages,
        format: typedBook.format,
        reviews: typedBook.reviews,
        createdAt: typedBook.createdAt,
        updatedAt: typedBook.updatedAt,
      };
      return {
        success: true,
        message: "Book Fetched Successfully!",
        data: finalData,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  deleteBookRepo: async (data: bookIdInterface): Promise<any> => {
    try {
      const book = await Book.findOne({ _id: data?._id }).lean();
      if (!book) {
        return {
          success: false,
          message: "Can Not Fetch Book Data!",
          data: null,
        };
      }
      await Book.findByIdAndDelete({ _id: data?._id });
      return {
        success: true,
        message: "Book Deleted Successfully!",
        data: null,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  addReviewRepo: async (review: BookReviews): Promise<any> => {
    try {
      const book = await Book.findById({ _id: review?.bookId });
      if (!book) {
        return {
          success: false,
          message: "Book not found!",
          data: null,
        };
      }

      const newReview = {
        userName: review.userName,
        comment: review.comment,
        rating: review.rating,
      };

      book.reviews.push(newReview);

      // Recalculate average rating
      if (book.reviews.length > 0) {
        const totalRating = book.reviews.reduce(
          (sum, r: any) => sum + (r?.rating || 0),
          0
        );
        const averageRating = totalRating / book.reviews.length;

        book.rating = parseFloat(averageRating.toFixed(1));
      } else {
        book.rating = 0; // or null, depending on your preference
      }

      // Save updated book
      await book.save();

      return {
        success: true,
        message: "Review added successfully!",
        data: book.reviews,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  fetchBookRepoByImage: async (filter: any) => {
    try {
      const books = await Book.find(filter);
      return {
        success: true,
        message: "Books Fetched Successfully!",
        data: books,
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

export default BookRepository;
