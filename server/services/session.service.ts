import { Response } from "express";
import SessionModel from "../models/session.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";

// create session
export const createSession = CatchAsyncError(async(data:any,res:Response)=>{
    const session = await SessionModel.create(data);
    res.status(201).json({
        success:true,
        session
    });
})


