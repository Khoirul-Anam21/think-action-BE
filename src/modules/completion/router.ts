import { Router } from "express";
import multer from "multer";
import * as controller from "./controller/index.js";
import { authorizeToken } from "@src/middleware/auth-middleware.js";
const upload = multer({ dest: "uploads/" });

const completionRouter = Router();

completionRouter.post(
  "/",
  authorizeToken,
  upload.array("images"),
  controller.createController
);
completionRouter.put(
  "/:id",
  authorizeToken,
  upload.array("images"),
  controller.updateController
);
completionRouter.delete("/:id", authorizeToken, controller.deleteController);
// completionRouter.post("/", authorizeToken, controller.createController);

export default completionRouter;
