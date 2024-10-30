import { Router } from "express";
// controllers
import * as controller from "./order.controller.js";
// middlewares
import * as middleware from "../../Middlewares/index.js";

const orderRouter = Router();
const { auth, errorHandler } = middleware;

orderRouter.post("/create", auth(), errorHandler(controller.createOrder));
// orderRouter.get("/", errorHandler(controller.getOrders))
// orderRouter.get("/details/:orderId", auth(), errorHandler(controller.getOrderById))
// orderRouter.put("/update/:orderId", auth(), errorHandler(controller.updateOrder))
// orderRouter.patch("/enable/:orderId", auth(), errorHandler(controller.toggleOrderStatus))



export {orderRouter}
