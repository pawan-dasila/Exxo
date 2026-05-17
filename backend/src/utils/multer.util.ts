import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const isValid = /^image\/(jpe?g|png|webp)$/.test(file.mimetype);
    if (!isValid) {
      return cb(
        new Error("Only .png, .jpg, .jpeg, and .webp formats allowed!"),
      );
    }

    cb(null, true);
  },
});
