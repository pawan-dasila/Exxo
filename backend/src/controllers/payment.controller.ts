import { Request, Response } from "express";
import { AsyncHandler } from "../middleware/AsyncHandler.middleware";
import { PaymentService } from "../services/payment.service";
import { HTTPSTATUS } from "../configs/Https.config";
import logger from "../utils/logger";

export class PaymentController {
  public static handleWebhook = AsyncHandler(
    async (req: Request & { rawBody?: Buffer }, res: Response) => {
      const signature = req.headers["x-razorpay-signature"];
      const rawBody = req.rawBody ? req.rawBody.toString() : "";

      if (!PaymentService.verifySignature(rawBody, signature as string)) {
        logger.warn("Invalid Razorpay webhook signature");
        return res
          .status(HTTPSTATUS.BAD_REQUEST)
          .json({ message: "Invalid signature" });
      }

      const event = req.body.event;
      const payload = req.body.payload;

      logger.info(`Received Razorpay Webhook: ${event}`);

      switch (event) {
        case "order.paid":
          await PaymentService.handlePaymentSuccess(payload);
          break;
        case "payment.failed":
          await PaymentService.handlePaymentFailure(payload);
          break;
        default:
          logger.info(`Unhandled Razorpay event: ${event}`);
      }

      // Always respond with 200 to Razorpay
      return res.status(HTTPSTATUS.OK).send("OK");
    },
  );
}
