import { Router } from "express";
import * as controller from "./controller/index.js";
import { authorizeToken } from "@src/middleware/auth-middleware.js";

const goalRouter = Router();

goalRouter.post("/", authorizeToken, controller.createController);
goalRouter.put("/:id", authorizeToken, controller.updateController);
goalRouter.delete("/:id", authorizeToken, controller.deleteController);
// goalRouter.post("/", authorizeToken, controller.createController);

export default goalRouter;
