import { Router } from "express";
import * as controller from "./controller/index.js";
import { authorizeToken } from "@src/middleware/auth-middleware.js";

const userSupportRouter = Router();

userSupportRouter.post("/", authorizeToken, controller.createController);
userSupportRouter.get("/supporters", authorizeToken, controller.readManySupporterController);
userSupportRouter.get("/supportings", authorizeToken, controller.readManySupportingController);
userSupportRouter.delete("/:id", authorizeToken, controller.deleteController);

export default userSupportRouter;
