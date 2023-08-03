import { Router } from "express";
import * as controller from "./controller/index.js";
import { authorizeToken } from "@src/middleware/auth-middleware.js";

const commentRouter = Router();

commentRouter.post("/", authorizeToken, controller.createController);
commentRouter.post("/replies", authorizeToken, controller.createReplyController);
// commentRouter.delete("/:id", authorizeToken, controller.deleteController);

export default commentRouter;
