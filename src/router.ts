import express, { Express } from "express";
import authRouter from "./modules/auth/router.js";
import categoryRouter from "./modules/category/router.js";
import goalRouter from "./modules/goal/router.js";
import resolutionRouter from "./modules/resolution/router.js";
import userSupportRouter from "./modules/support/router.js";
import userRouter from "./modules/user/router.js";
import cheerRouter from "./modules/cheer/router.js";
import commentRouter from "./modules/comment/router.js";

export default async function () {
  const app: Express = express();

  /**
   * Register all available modules
   * <modules>/router.ts
   */
  // app.use("/v1/examples", exampleRouter);
  app.use("/auth", authRouter);
  app.use("/users", userRouter);
  app.use("/resolutions", resolutionRouter);
  app.use("/goals", goalRouter);
  // app.use("/completion", completionRouter);
  app.use("/cheers", cheerRouter);
  app.use("/supports", userSupportRouter);
  app.use("/categories", categoryRouter);
  app.use("/comments", commentRouter)

  return app;
}
