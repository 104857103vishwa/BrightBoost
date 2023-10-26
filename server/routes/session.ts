import express from "express";
import {
  editSession,
  getAllSessions,
  getSingleSession,
  //   addAnwser,
  //   addQuestion,
  //   addReplyToReview,
  //   addReview,
  //   deleteSession,
  //   editSession,
  //   generateVideoUrl,
  //   getAdminAllSessions,
    getSessionByUser,
  uploadSession,
  addQuestion,
  addAnwser,
  getAdminAllSessions,
  deleteSession,
} from "../controllers/session.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
const sessionRouter = express.Router();

sessionRouter.post(
  "/create-session",
  isAutheticated,
  authorizeRoles("admin"),
  uploadSession
);

sessionRouter.put(
  "/edit-session/:id",
  isAutheticated,
  authorizeRoles("admin"),
  editSession
);

sessionRouter.get("/get-session/:id", getSingleSession);

sessionRouter.get("/get-sessions", getAllSessions);

sessionRouter.get(
  "/get-all-sessions-admin",
  isAutheticated,
  authorizeRoles("admin"),
  getAdminAllSessions
);

sessionRouter.get("/get-session-content/:id", isAutheticated, getSessionByUser);

sessionRouter.put("/add-question", isAutheticated, addQuestion);

sessionRouter.put("/add-answer", isAutheticated, addAnwser);

// sessionRouter.put("/add-review/:id", isAutheticated, addReview);

// sessionRouter.put(
//   "/add-reply",
//   isAutheticated,
//   authorizeRoles("admin"),
//   addReplyToReview
// );

// sessionRouter.post("/getVdoCipherOTP", generateVideoUrl);

sessionRouter.delete(
  "/delete-session/:id",
  isAutheticated,
  authorizeRoles("admin"),
  deleteSession
);

export default sessionRouter;
