import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  createPayment,
//   getAllPayments,
//   newPayment,
//   sendStripePublishableKey,
} from "../controllers/payment.controller";
const paymentRouter = express.Router();

paymentRouter.post("/create-payment", isAutheticated, createPayment);

// paymentRouter.get(
//   "/get-payments",
//   isAutheticated,
//   authorizeRoles("admin"),
//   getAllPayments
// );

// paymentRouter.get("/payment/stripepublishablekey", sendStripePublishableKey);

// paymentRouter.post("/payment", isAutheticated, newPayment);

export default paymentRouter;
