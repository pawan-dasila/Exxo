import { Router } from "express";
import { RentalController } from "../controllers/rental.controller";
import { ExtensionController } from "../controllers/extension.controller";
import { TrustController } from "../controllers/trust.controller";
import { Protect, VerifiedOnly } from "../middleware/auth.middleware";

const router = Router();

router.use(Protect);

// Verified borrowers only can book
router.post("/", VerifiedOnly, RentalController.createRentalOrder);
router.get("/my-orders", RentalController.getMyOrders);
router.patch("/:id/status", RentalController.updateOrderStatus);

// Rental Extension Requests
router.post("/:orderId/extensions", VerifiedOnly, ExtensionController.requestExtension);
router.get("/:orderId/extensions", ExtensionController.getExtensionsByOrder);
router.post("/extensions/:requestId/approve", VerifiedOnly, ExtensionController.approveExtension);
router.post("/extensions/:requestId/reject", VerifiedOnly, ExtensionController.rejectExtension);

// Trust, Safety & Disputes
router.post("/:orderId/inspections", VerifiedOnly, TrustController.recordInspection);
router.post("/:orderId/damages", VerifiedOnly, TrustController.reportDamage);
router.post("/:orderId/disputes", VerifiedOnly, TrustController.openDispute);
router.get("/:orderId/trust-records", TrustController.getTrustRecords);

export default router;
