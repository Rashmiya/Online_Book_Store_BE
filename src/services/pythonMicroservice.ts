import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const PYTHON_SERVICE_URL = "http://127.0.0.1:5001/search"; // Make sure this matches Flask route

const pythonMicroservice = {
  getMatchedBookIds: async (imageBuffer: Buffer): Promise<string[]> => {
  try {
    const formData = new FormData();
    formData.append("image", imageBuffer, {
      filename: "image.jpg",  // Adjust file name if needed
      contentType: "image/webp",  // Adjust based on your image type
    });

    const response = await axios.post(PYTHON_SERVICE_URL, formData, {
      headers: formData.getHeaders(),
    });

    // Assuming the response is like { success: true, data: ['bookId1', 'bookId2'] }
    return response.data.data || [];
  } catch (err) {
    console.error("Error calling Python service:", err);
    return [];
  }
}
};

export default pythonMicroservice;
