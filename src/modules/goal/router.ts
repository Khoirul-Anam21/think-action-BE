import { Router } from "express";
import multer from "multer";
import * as controller from "./controller/index.js";
import { authorizeToken } from "@src/middleware/auth-middleware.js";
const upload = multer({ dest: "uploads/" });

const goalRouter = Router();

goalRouter.post(
  "/",
  authorizeToken,
  upload.array("images"),
  controller.createController
);
goalRouter.put(
  "/:id",
  authorizeToken,
  upload.array("images"),
  controller.updateController
);
goalRouter.get(
  "/category/:id",
  authorizeToken,
  controller.readManyByCategoryController
);
goalRouter.delete("/:id", authorizeToken, controller.deleteController);
// goalRouter.post("/", authorizeToken, controller.createController);

export default goalRouter;
