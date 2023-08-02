import { Router } from "express";
import * as controller from "./controller/index.js";
import { authorizeToken } from "@src/middleware/auth-middleware.js";

const reportRouter = Router();

reportRouter.get("/:year/:month", authorizeToken, controller.readMonthlyController);
reportRouter.get("/:year", authorizeToken, controller.readYearlyController);

export default reportRouter;
