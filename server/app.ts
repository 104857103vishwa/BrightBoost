require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/generalErrors";
import userRouter from "./routes/user";
import sessionRouter from "./routes/session";

export const app = express();

//body Parser
app.use(express.json({ limit: "50mb" }));

//cookie Parser
app.use(cookieParser());

//CORS Configuration
app.use(
  cors({
    origin: process.env.ORIGIN
  })
);

// routes
app.use(
  "/api/v1",
  userRouter,
  sessionRouter,
);


//API Test
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    succcess: true,
    message: "API is working",
  });
});

//If original URL not found, unauthorized routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);
