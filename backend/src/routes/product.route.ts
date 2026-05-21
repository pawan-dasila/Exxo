import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { AvailabilityController } from "../controllers/availability.controller";
import { Protect, VerifiedOnly } from "../middleware/auth.middleware";
import { UploadImages } from "../middleware/upload.middleware";

const router = Router();

// Public routes
router.get("/", ProductController.getAllProducts);
router.get("/:id/availability", AvailabilityController.getBlockedRanges);
router.get("/:id/check-availability", AvailabilityController.checkAvailability);
router.patch("/:id/click", ProductController.clickProduct);

// Saved Searches (Authenticated)
router.post("/saved-searches", Protect, ProductController.saveSearch);
router.get("/saved-searches", Protect, ProductController.getSavedSearches);

router.get("/:slug", ProductController.getProductBySlug);

// Protected routes
router.use(Protect);

// Verified lenders only can list products
router.post("/", VerifiedOnly, UploadImages("images", 5), ProductController.createProduct);

router.patch("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

// Availability blocks (Lenders only)
router.post("/:id/block-availability", VerifiedOnly, AvailabilityController.blockDates);
router.delete("/blocks/:blockId", VerifiedOnly, AvailabilityController.unblockDates);

export default router;
