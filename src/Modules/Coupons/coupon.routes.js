import { Router } from "express";
// controllers
import * as controller from "./coupon.controller.js";
// middlewares
import * as middleware from "../../Middlewares/index.js";
import { CreateCouponSchema } from "./coupon.schema.js";

const addressRouter = Router();
const { auth, errorHandler, validationMiddleware } = middleware;

addressRouter.post("/create", auth(), validationMiddleware(CreateCouponSchema), errorHandler(controller.createCoupon));


export {addressRouter}
