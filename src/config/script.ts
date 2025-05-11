import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
// Environment Variables
const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

// Upload File to Cloudinary
export const uploadFileToCloudinary = async (
  file: any,
  folder: string
): Promise<string | null> => {
  try {
    if (!file) return null;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "auto", // Auto-detect resource type (image, video, pdf, etc.)
          // use_filename: true, // 👈 Keep original filename
          // unique_filename: false,
        },
        (error, result) => {
          if (error) {
            console.error("Upload to Cloudinary failed:", error);
            reject(error);
          } else {
            resolve(result?.secure_url || null);
          }
        }
      );

      uploadStream.end(file.buffer);
    });
  } catch (error: any) {
    console.error("Error in uploadFileToCloudinary:", error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};
