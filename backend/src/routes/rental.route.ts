import { Router } from "express";
import { RentalController } from "../controllers/rental.controller";
import { Protect, VerifiedOnly } from "../middleware/auth.middleware";

const router = Router();

router.use(Protect);

// Verified borrowers only can book
router.post("/", VerifiedOnly, RentalController.createRentalOrder);
router.get("/my-orders", RentalController.getMyOrders);
router.patch("/:id/status", RentalController.updateOrderStatus);

export default router;
