import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { IPayment } from "../models/payment.Model";
import userModel from "../models/user.model";
import SessionModel, { ISession } from "../models/session.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
// import { getAllPaymentsService, newPayment } from "../services/payment.service";
import { redis } from "../utils/redis";
import { getAllPaymentsService, newPayment } from "../services/payment.service";
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// create payment
export const createPayment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId, annualPayment, payment_info } = req.body as IPayment;

      if (payment_info) {
        if ("id" in payment_info) {
          const paymentIntentId = payment_info.id;
          const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
          );

          if (paymentIntent.status !== "succeeded") {
            return next(new ErrorHandler("Payment not authorized!", 400));
          }
        }
      }

      const user = await userModel.findById(req.user?._id);

    
      const sessionExistInUser = user?.sessions.some(
        (session: any) => session._id.toString() === sessionId
      );

      if (sessionExistInUser) {
        return next(
          new ErrorHandler("You have already enrolled to this session", 400)
        );
      }

      const session:ISession | null = await SessionModel.findById(sessionId);

      if (!session) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const data: any = {
        sessionId: session._id,
        userId: user?._id,
        payment_info,
      };

      const mailData = {
        payment: {
          firstName : user.firstName,
          lastName : user.lastName,
          email : user.email,
          _id: session._id.toString().slice(0, 6),
          name: session.name,
          price: session.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/payment-confirmation.ejs"),
        { payment: mailData }
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Payment Confirmation",
            template: "payment-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      user?.sessions.push(session?._id);

      await redis.set(req.user?._id, JSON.stringify(user));

      await user?.save();

      await NotificationModel.create({
        user: user?._id,
        title: "New Payment",
        message: `You have a new payment from ${user?.email}`,
      });

      session.purchased = session.purchased + 1;

      await session.save();

      newPayment(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get All payments --- only for admin
export const getAllPayments = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllPaymentsService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// //  send stripe publishble key
// export const sendStripePublishableKey = CatchAsyncError(
//   async (req: Request, res: Response) => {
//     res.status(200).json({
//       publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
//     });
//   }
// );

// // new payment
// export const newPayment = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const myPayment = await stripe.paymentIntents.create({
//         amount: req.body.amount,
//         currency: "AUD",
//         metadata: {
//           company: "BrightBoost",
//         },
//         automatic_payment_methods: {
//           enabled: true,
//         },
//       });

//       res.status(201).json({
//         success: true,
//         client_secret: myPayment.client_secret,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );
