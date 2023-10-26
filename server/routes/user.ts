import express from "express";
import {
  activateUser,
  deleteUser,
  getAllUsers,
  getUserData,
  loginUser,
  logoutUser,
  registrationUser,
  socialLogin,
  updateAccessToken,
  updatePassword,
  updateProfilePicture,
  updateRole,
  updateUser,
} from "../controllers/user.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
const userRouter = express.Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAutheticated, logoutUser);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/user", isAutheticated, getUserData);
userRouter.post("/social-login", socialLogin);
userRouter.put("/update-user", isAutheticated, updateUser);
userRouter.put("/update-password", isAutheticated, updatePassword);
userRouter.put("/update-profile-picture", isAutheticated, updateProfilePicture);

export default userRouter;

// authorizeRoles("admin") - add to define role

userRouter.get(
  "/get-users",
  isAutheticated,
  authorizeRoles("admin"),
  getAllUsers
);

userRouter.put(
  "/update-role",
  isAutheticated,
  authorizeRoles("admin"),
  updateRole
);

userRouter.delete(
  "/delete-user/:id",
  isAutheticated,
  authorizeRoles("admin"),
  deleteUser
);
