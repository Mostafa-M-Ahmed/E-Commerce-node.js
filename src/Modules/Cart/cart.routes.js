import { Router } from "express";
import * as controller from "./cart.controller.js";
import * as middleware from "../../Middlewares/index.js"

const cartRouter = Router();
const { auth, errorHandler } = middleware;

cartRouter.post("/add/:productId", auth(), errorHandler(controller.AddToCart));
cartRouter.put("/remove/:productId", auth(), errorHandler(controller.removeFromCart));

export { cartRouter };