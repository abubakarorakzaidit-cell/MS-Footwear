import dotenv from "dotenv";
dotenv.config();
import ImageKit from "imagekit";

// Server-side ImageKit instance.
// IMAGEKIT_PRIVATE_KEY must NEVER be sent to the frontend.
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload a single image buffer to ImageKit.
 * @param {Buffer} fileBuffer
 * @param {string} fileName
 * @param {string} folder - e.g. "/ms-footwear/products"
 * @returns {Promise<{url: string, fileId: string}>}
 */
export const uploadImage = async (fileBuffer, fileName, folder = "/ms-footwear/products") => {
  const result = await imagekit.upload({
    file: fileBuffer.toString("base64"),
    fileName,
    folder,
    useUniqueFileName: true,
  });
  return { url: result.url, fileId: result.fileId };
};

/**
 * Upload multiple images in parallel.
 * @param {Array<{buffer: Buffer, originalname: string}>} files
 * @returns {Promise<Array<{url: string, fileId: string}>>}
 */
export const uploadImages = async (files, folder = "/ms-footwear/products") => {
  const uploads = files.map((file) => uploadImage(file.buffer, file.originalname, folder));
  return Promise.all(uploads);
};

/**
 * Delete an image from ImageKit by its fileId.
 * Fails silently (logs) so a failed deletion never blocks a product delete.
 */
export const deleteImage = async (fileId) => {
  if (!fileId) return;
  try {
    await imagekit.deleteFile(fileId);
  } catch (err) {
    console.error(`ImageKit: failed to delete file ${fileId}:`, err.message);
  }
};

/**
 * Delete multiple images from ImageKit.
 */
export const deleteImages = async (fileIds = []) => {
  await Promise.all(fileIds.filter(Boolean).map((id) => deleteImage(id)));
};

/**
 * Generate ImageKit authentication parameters for direct client-side upload
 * (not used by default flow, kept available if needed later).
 */
export const getAuthenticationParameters = () => imagekit.getAuthenticationParameters();

export default imagekit;
