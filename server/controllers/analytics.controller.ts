import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { generateLast12MothsData } from "../utils/analytics.generator";
import userModel from "../models/user.model";
import SessionModel from "../models/session.model";
import PaymentModel from "../models/payment.model";

// get users analytics --- only for admin
export const getUsersAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MothsData(userModel);

      res.status(200).json({
        success: true,
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get courses analytics --- only for admin
export const getSessionsAnalytics = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const courses = await generateLast12MothsData(SessionModel);
  
        res.status(200).json({
          success: true,
          courses,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  );
  
  
// get payment analytics --- only for admin
export const getPaymentAnalytics = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const payments = await generateLast12MothsData(PaymentModel);
  
        res.status(200).json({
          success: true,
          payments,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  );
  