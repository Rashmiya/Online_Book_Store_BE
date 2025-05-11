import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING || "";

const CONTAINER_NAME = "book-previews";

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

export const uploadToAzureBlob = async (
  buffer: Buffer,
  originalName: string,
  mimetype: string
): Promise<string> => {
  const blobName = uuidv4() + "-" + originalName;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const options = { blobHTTPHeaders: { blobContentType: mimetype } };
  await blockBlobClient.uploadData(buffer, options);
  return blockBlobClient.url;
};
