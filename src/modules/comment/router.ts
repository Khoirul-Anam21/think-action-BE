import { Router } from "express";
import * as controller from "./controller/index.js";
import { authorizeToken } from "@src/middleware/auth-middleware.js";

const commentRouter = Router();

commentRouter.get("/", authorizeToken, controller.createController);
commentRouter.post("/", authorizeToken, controller.createController);
commentRouter.post("/replies", authorizeToken, controller.createReplyController);
commentRouter.put("/:id", authorizeToken, controller.createController);
commentRouter.put("/replies/:id", authorizeToken, controller.createController);
commentRouter.delete("/:id", authorizeToken, controller.createController);
commentRouter.delete("/replies/:id", authorizeToken, controller.deleteController);

export default commentRouter;
