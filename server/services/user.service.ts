import { Response } from "express";
import { redis } from "../utils/redis";
import userModel from "../models/user.model";

// get user by id
export const getUserById = async (id: string, res: Response) => {
  const toParserUser = await redis.get(id);
  // const user = await userModel.findById(id);

  if (toParserUser) {
    const user = JSON.parse(toParserUser);
    res.status(201).json({
      success: true,
      user,
    });
  }
};
