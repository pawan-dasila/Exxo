import { Router } from "express";
import { PaymentController } from '../controllers/payment.controller.js';

const router = Router();

// Webhook endpoint (Public, signature verified in controller)
router.post("/webhook", PaymentController.handleWebhook);

export default router;
