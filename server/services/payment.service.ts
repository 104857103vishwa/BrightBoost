import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import PaymentModel from "../models/payment.model";

// create new order
export const newPayment = CatchAsyncError(async (data: any, res: Response) => {
  const payment = await PaymentModel.create(data);

  res.status(201).json({
    succcess: true,
    payment,
  });
});

// Get All Orders
export const getAllOrdersService = async (res: Response) => {
  const payments = await PaymentModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    payments,
  });
};
