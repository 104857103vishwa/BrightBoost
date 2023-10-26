import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { getSessionsAnalytics, getPaymentAnalytics, getUsersAnalytics } from "../controllers/analytics.controller";
const analyticsRouter = express.Router();


analyticsRouter.get("/get-users-analytics", isAutheticated,authorizeRoles("admin"), getUsersAnalytics);

analyticsRouter.get("/get-payments-analytics", isAutheticated,authorizeRoles("admin"), getPaymentAnalytics);

analyticsRouter.get("/get-sessions-analytics", isAutheticated,authorizeRoles("admin"), getSessionsAnalytics);


export default analyticsRouter;