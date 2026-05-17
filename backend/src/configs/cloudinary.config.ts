import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Env } from "./env.config";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: Env.CLOUDINARY_CLOUD_NAME,
  api_key: Env.CLOUDINARY_API_KEY,
  api_secret: Env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const CLOUDINARY_FOLDERS = {
  PROFILE: "startup/profile",
  CATEGORY: "startup/category",
  PRODUCT: "startup/product",
} as const;

export type CloudinaryFolder =
  (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];

export class CloudinaryService {
  /**
   * Uploads an image buffer directly to Cloudinary using a readable stream.
   * This avoids needing to convert the buffer to base64 or saving it to disk.
   */
  public static async uploadImageBuffer(
    fileBuffer: Buffer,
    folder: CloudinaryFolder,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          format: "webp",
          allowed_formats: ["jpg", "png", "jpeg", "webp"],
          resource_type: "image",
          quality: "auto:good",
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(new Error("Upload failed, no result returned"));
          resolve(result);
        },
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }

  /**
   * Optional helper to delete an image by its public ID.
   */
  public static async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(
        `Failed to delete image ${publicId} from Cloudinary:`,
        error,
      );
      throw error;
    }
  }
}
