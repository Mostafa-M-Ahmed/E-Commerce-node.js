import { Router } from "express";
// controllers
import * as controller from "./coupon.controller.js";
// middlewares
import * as middleware from "../../Middlewares/index.js";
import { CreateCouponSchema, UpdateCouponSchema } from "./coupon.schema.js";

const couponRouter = Router();
const { auth, errorHandler, validationMiddleware } = middleware;

couponRouter.post("/create", auth(), validationMiddleware(CreateCouponSchema), errorHandler(controller.createCoupon));
couponRouter.get("/", errorHandler(controller.getCoupons))
couponRouter.get("/details/:couponId", auth(), errorHandler(controller.getCouponById))
couponRouter.put("/update/:couponId", auth(), validationMiddleware(UpdateCouponSchema), errorHandler(controller.updateCoupon))
couponRouter.patch("/enable/:couponId", auth(), errorHandler(controller.toggleCouponStatus))



export {couponRouter}
