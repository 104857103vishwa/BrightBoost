import express from "express";
import {
  activateUser, getUserData, loginUser, logoutUser, registrationUser, socialLogin, updateAccessToken,
} from "../controllers/user.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
const userRouter = express.Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAutheticated, authorizeRoles("admin"), logoutUser);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/user", isAutheticated, getUserData);
userRouter.post("/social-login", socialLogin);


export default userRouter;
