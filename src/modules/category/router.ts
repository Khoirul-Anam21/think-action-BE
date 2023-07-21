import { Router } from "express";
import * as controller from "./controller/index.js";
import { authorizeToken } from "@src/middleware/auth-middleware.js";

const categoryRouter = Router();

categoryRouter.post("/", authorizeToken, controller.createController);
categoryRouter.get("/", authorizeToken, controller.readManyCategoryController);
categoryRouter.delete("/:id", authorizeToken, controller.deleteController);

export default categoryRouter;
