import { Request, Response, NextFunction } from "express";
import { upload } from "../utils/multer.util";
import { CloudinaryService, CLOUDINARY_FOLDERS } from "../configs/cloudinary.config";
import { AppError } from "../utils/AppError";
import { HTTPSTATUS } from "../configs/Https.config";
import { ErrorCodeEnum } from "../enums/error-code.enum";

/**
 * Middleware to handle multiple image uploads to Cloudinary.
 * Attaches an array of URLs to req.body.images
 */
export const UploadImages = (fieldName: string, maxCount: number = 5) => {
  const multerUpload = upload.array(fieldName, maxCount);

  return (req: Request, res: Response, next: NextFunction) => {
    multerUpload(req, res, async (err) => {
      if (err) {
        return next(new AppError(err.message, HTTPSTATUS.BAD_REQUEST, ErrorCodeEnum.VALIDATION_ERROR));
      }

      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return next();
      }

      try {
        const files = req.files as Express.Multer.File[];
        const uploadPromises = files.map(file => 
          CloudinaryService.uploadImageBuffer(file.buffer, CLOUDINARY_FOLDERS.PRODUCT)
        );

        const results = await Promise.all(uploadPromises);
        req.body.images = results.map(result => result.secure_url);
        
        next();
      } catch {
        next(new AppError("Failed to upload images to Cloudinary", HTTPSTATUS.INTERNAL_SERVER_ERROR, ErrorCodeEnum.INTERNAL_SERVER_ERROR));
      }
    });
  };
};
