import { Router } from "express";
import * as controller from "./controller/index.js";

const authRouter = Router();

authRouter.get("/google", controller.authController);
authRouter.get("/google-callback", controller.authCallbackController);

export default authRouter;
