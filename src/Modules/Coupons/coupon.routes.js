import { Router } from "express";
// controllers
import * as controller from "./coupon.controller.js";
// middlewares
import * as middleware from "../../Middlewares/index.js";
import { CreateCouponSchema } from "./coupon.schema.js";

const couponRouter = Router();
const { auth, errorHandler, validationMiddleware } = middleware;

couponRouter.post("/create", auth(), validationMiddleware(CreateCouponSchema), errorHandler(controller.createCoupon));
couponRouter.get("/", errorHandler(controller.getCoupons))
couponRouter.get("/details/:couponId", auth(), errorHandler(controller.getCouponById))
couponRouter.get("/update/:couponId", auth(), validationMiddleware(updateCoupon), errorHandler(controller.updateCoupon))



export {couponRouter}
