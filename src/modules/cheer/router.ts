import { Router } from "express";
import * as controller from "./controller/index.js";
import { authorizeToken } from "@src/middleware/auth-middleware.js";

const cheerRouter = Router();

cheerRouter.get("/", authorizeToken, controller.readManySupporterController);
cheerRouter.post("/", authorizeToken, controller.createController);
cheerRouter.delete("/:id", authorizeToken, controller.deleteController);

export default cheerRouter;
