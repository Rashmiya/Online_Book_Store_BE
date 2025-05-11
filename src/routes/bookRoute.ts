import express from "express";
import multer from "multer";
import BookController from "../controllers/bookController";
import { permissions } from "../middleware/checkAuth";

// Configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
});

// Setup multer middleware for file uploads
const bookUpload = upload.fields([
  { name: "cover_images", maxCount: 5 },
  { name: "pdf_file", maxCount: 1 },
]);

// For book creation and update
// const bookUpload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 10 * 1024 * 1024 },
// }).fields([
//   { name: "cover_images", maxCount: 5 },
//   { name: "pdf_file", maxCount: 1 },
// ]);

// For image search
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("searching_image");

const route = express.Router();
route.get("/all", BookController?.getAllBook);
route.get("/view", BookController?.fetchBook);
route.post("/create", permissions, bookUpload, BookController?.saveBook); //auth,role
route.put("/update", permissions, bookUpload, BookController?.updateBook); //auth,role
route.delete("/delete", permissions, BookController?.deleteBook); //auth,role
route.post("/review", permissions, BookController.addReview);
route.post("/search-by-image", imageUpload, BookController.searchByImage);

export default route;
