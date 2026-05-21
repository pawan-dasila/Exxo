import { Router } from "express";
import { UserController } from '../controllers/user.controller.js';
import { Protect } from '../middleware/auth.middleware.js';
import { upload } from '../utils/multer.util.js';

const userRoutes = Router();

// Apply protection to all user routes
userRoutes.use(Protect);

// Profile
userRoutes.get("/profile", UserController.getProfile);
userRoutes.patch(
  "/profile",
  upload.single("profileImage"),
  UserController.updateProfile
);
userRoutes.patch("/change-password", UserController.changePassword);

// Addresses
userRoutes.post("/addresses", UserController.addAddress);
userRoutes.get("/addresses", UserController.getAddresses);
userRoutes.patch("/addresses/:id", UserController.updateAddress);
userRoutes.delete("/addresses/:id", UserController.deleteAddress);

export default userRoutes;
