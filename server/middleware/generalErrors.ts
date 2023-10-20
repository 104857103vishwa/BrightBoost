import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  //wrong mongodb id
  if (err.name === "CastError") {
    const message = `Wrong MongoDB ID - Invalid Path : ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //duplicate key
  if (err.code === 11000) {
    const message = `Duplicate Key ${Object.keys(err.keyValue)}`;
    err = new ErrorHandler(message, 400);
  }


  //invalid web token
  if (err.name === "JsonWebTokenError") {
    const message = `Invalid JSON Web Token`;
    err = new ErrorHandler(message, 400);
  }
  
  //expired web token
  if (err.name === "TokenExpiredError") {
    const message = `Expired JSON Web Token`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
