import { Router } from "express";
import * as controller from "./controller/index.js";
import { authorizeToken } from "@src/middleware/auth-middleware.js";

const notificationRouter = Router();

notificationRouter.get("/", authorizeToken, controller.readManyCheersController);
notificationRouter.post("/", authorizeToken, controller.createController);
notificationRouter.delete("/:id", authorizeToken, controller.deleteController);

// create notif add default value, read false, after opened read become false by sending an array of notif id
// in notifying in post, get user identity by getting post by post id
// don't display a content if account is private

export default notificationRouter;
