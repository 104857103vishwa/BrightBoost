import { Response } from "express";
import { redis } from "../utils/redis";
import userModel from "../models/user.model";

// get user by id
export const getUserById = async (id: string, res: Response) => {
  //   const userJson = await redis.get(id);
  const user = await userModel.findById(id);

  //   if (user) {
  //   const user = JSON.parse(user);
  res.status(201).json({
    success: true,
    user,
  });
  //   }
}; 
