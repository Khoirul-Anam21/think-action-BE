import { Router } from "express";
import * as controller from "./controller/index.js";

const authRouter = Router();

authRouter.get("/google", controller.authGoogleController);
authRouter.get("/google-cb", controller.authGoogleCallbackController);

export default authRouter;
