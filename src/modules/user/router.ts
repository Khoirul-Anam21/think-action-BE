import { Router } from "express";
import multer from "multer";
import * as controller from "./controller/index.js";
import { authorizeToken } from "@src/middleware/auth-middleware.js";

const upload = multer({ dest: "uploads/" });

const userRouter = Router();

// router.get("/", controller.retrieveAllController);
// router.post("/", controller.createController);
userRouter.get("/:id", authorizeToken, controller.retrieveController);
userRouter.patch("/:id", authorizeToken, upload.single("photo"), controller.updateController);
userRouter.delete("/:id", authorizeToken, controller.deleteController);
// router.post("/create-many", controller.createManyController);
// router.post("/update-many", controller.updateManyController);
// router.post("/delete-many", controller.deleteManyController);

export default userRouter;
