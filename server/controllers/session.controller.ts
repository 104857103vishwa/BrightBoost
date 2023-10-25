import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createSession } from "../services/session.service";
import SessionModel, { IComment } from "../models/session.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
// import NotificationModel from "../models/notification.Model";
import axios from "axios";
import NotificationModel from "../models/notification.model";
import { Session } from "inspector";

// create Session
export const uploadSession = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "sessions",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createSession(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


// edit Session
export const editSession = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const thumbnail = data.thumbnail;

      const sessionId = req.params.id;

      const sessionData = await SessionModel.findById(sessionId) as any;

      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(sessionData.thumbnail.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "sessions",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      if (thumbnail) {
        data.thumbnail = {
          public_id: sessionData?.thumbnail.public_id,
          url: sessionData?.thumbnail.url,
        };
      }

      const session = await SessionModel.findByIdAndUpdate(
        sessionId,
        {
          $set: data,
        },
        { new: true }
      );

      res.status(201).json({
        success: true,
        session,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get single session
export const getSingleSession = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.params.id;

      const isCacheExist = await redis.get(sessionId);

      if (isCacheExist) {
        const session = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          session,
        });
      } else {
        const session = await SessionModel.findById(req.params.id).select(
          "-sessionData.videoUrl -sessionData.suggestion -sessionData.questions -sessionData.links"
        );

        await redis.set(sessionId, JSON.stringify(session), "EX", 604800); // 7days

        res.status(200).json({
          success: true,
          session,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


// get all sessions
export const getAllSessions = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessions = await SessionModel.find().select(
        "-sessionData.videoUrl -sessionData.suggestion -sessionData.questions -sessionData.links"
      );

      res.status(200).json({
        success: true,
        sessions,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


// get session content -- only for valid user
export const getSessionByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.sessions;
      const sessionId = req.params.id;

      const sessionExists = userCourseList?.find(
        (session: any) => session._id.toString() === sessionId
      );

      if (!sessionExists) {
        return next(
          new ErrorHandler("You are not eligible to access this session", 404)
        );
      }

      const session = await SessionModel.findById(sessionId);

      const content = session?.sessionData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add question in course
interface IAddQuestionData {
  question: string;
  sessionId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, sessionId, contentId }: IAddQuestionData = req.body;
      const session = await SessionModel.findById(sessionId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const sessionContent = session?.sessionData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!sessionContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      // create a new question object
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      // add this question to our course content
      sessionContent.questions.push(newQuestion);

      await NotificationModel.create({
        user: req.user?._id,
        title: "New Question Received",
        message: `You have a new question in ${sessionContent.title}`,
      });

      // save the updated course
      await session?.save();

      res.status(200).json({
        success: true,
        session,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add answer in course question
interface IAddAnswerData {
  answer: string;
  sessionId: string;
  contentId: string;
  questionId: string;
}

export const addAnwser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, sessionId, contentId, questionId }: IAddAnswerData =
        req.body;

      const course = await SessionModel.findById(sessionId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const couseContent = course?.sessionData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!couseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const question = couseContent?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );

      if (!question) {
        return next(new ErrorHandler("Invalid question id", 400));
      }

      // create a new answer object
      const newAnswer: any = {
        user: req.user,
        answer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // add this answer to our course content
      question.questionReplies.push(newAnswer);

      await course?.save();

      if (req.user?._id === question.user._id) {
        // create a notification
        await NotificationModel.create({
          user: req.user?._id,
          title: "New Question Reply Received",
          message: `You have a new question reply in ${couseContent.title}`,
        });
      } else {
        const data = {
          name: question.user.firstName,
          title: couseContent.title,
        };

        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
