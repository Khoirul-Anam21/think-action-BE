import { Router } from "express";
import * as controller from "./controller/index.js";

const userRouter = Router();

// router.get("/", controller.retrieveAllController);
// router.post("/", controller.createController);
// userRouter.get("/:id", controller.retrieveController);
userRouter.patch("/:id", controller.updateController);
userRouter.delete("/:id", controller.deleteController);
// router.post("/create-many", controller.createManyController);
// router.post("/update-many", controller.updateManyController);
// router.post("/delete-many", controller.deleteManyController);

export default userRouter;
