import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  createPayment, getAllPayments,
//   getAllPayments,
//   newPayment,
//   sendStripePublishableKey,
} from "../controllers/payment.controller";
const paymentRouter = express.Router();

paymentRouter.post("/create-payment", isAutheticated, createPayment);

paymentRouter.get(
  "/get-all-payments-admin",
  isAutheticated,
  authorizeRoles("admin"),
  getAllPayments
);

// paymentRouter.get("/payment/stripepublishablekey", sendStripePublishableKey);

// paymentRouter.post("/payment", isAutheticated, newPayment);

export default paymentRouter;
