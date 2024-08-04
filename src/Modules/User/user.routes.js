import { Router } from "express" ;
// controllers
import * as controller from "./user.controller.js"
// middlewares
import * as Middlewares from "../../Middlewares/index.js"
const userRouter = Router();
const { errorHandler } = Middlewares;

userRouter.post("/register", errorHandler(controller.registerUser));

userRouter.patch( "/update/:userId", errorHandler(controller.updateAccount)) ;

userRouter.delete("/delete/:userId", errorHandler(controller.deleteAccount));

export { userRouter };