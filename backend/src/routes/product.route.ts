import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { Protect, VerifiedOnly } from "../middleware/auth.middleware";
import { UploadImages } from "../middleware/upload.middleware";

const router = Router();

// Public routes
router.get("/", ProductController.getAllProducts);
router.get("/:slug", ProductController.getProductBySlug);

// Protected routes
router.use(Protect);

// Verified lenders only can list products
router.post("/", VerifiedOnly, UploadImages("images", 5), ProductController.createProduct);

router.patch("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

export default router;
