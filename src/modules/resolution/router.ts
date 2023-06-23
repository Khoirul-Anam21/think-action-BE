import { Router } from "express";
import * as controller from "./controller/index.js";

const resolutionRouter = Router();

// router.get("/", controller.retrieveAllController);
// router.post("/", controller.createController);
// router.get("/:id", controller.retrieveController);
resolutionRouter.patch("/:id", controller.updateController);
resolutionRouter.delete("/:id", controller.deleteController);
// router.post("/create-many", controller.createManyController);
// router.post("/update-many", controller.updateManyController);
// router.post("/delete-many", controller.deleteManyController);

export default resolutionRouter;
