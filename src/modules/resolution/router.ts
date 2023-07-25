import { Router } from "express";
import multer from "multer";
import * as controller from "./controller/index.js";
import { authorizeToken } from "@src/middleware/auth-middleware.js";
const upload = multer({ dest: "uploads/" });

const resolutionRouter = Router();

// router.get("/", controller.retrieveAllController);
resolutionRouter.post("/", upload.array("images"), authorizeToken, controller.createController);
resolutionRouter.get("/", authorizeToken, controller.readManyController);
resolutionRouter.get("/user", authorizeToken, controller.readManyController);
// router.get("/:id", controller.retrieveController);
resolutionRouter.put("/:id", upload.array("images"), controller.updateController);
resolutionRouter.delete("/:id", controller.deleteController);
// router.post("/create-many", controller.createManyController);
// router.post("/update-many", controller.updateManyController);
// router.post("/delete-many", controller.deleteManyController);

export default resolutionRouter;
