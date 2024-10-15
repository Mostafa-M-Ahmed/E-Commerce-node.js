import { Router } from "express";
// controllers
import * as controller from "./address.controller.js";
// middlewares
import * as middleware from "../../Middlewares/index.js";

const addressRouter = Router();
const { auth, errorHandler } = middleware;

addressRouter.post("/add", auth(), errorHandler(controller.addAddress));
addressRouter.put("/edit/:id", auth(), errorHandler(controller.editAddress));
addressRouter.put("/soft-delete/:id", auth(), errorHandler(controller.deleteAddress));
addressRouter.get("/", auth(), errorHandler(controller.getAddresses));


export {addressRouter}
