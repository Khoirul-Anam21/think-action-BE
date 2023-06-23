import express, { Express } from "express";
import authRouter from "./modules/auth/router.js";
import resolutionRouter from "./modules/resolution/router.js";
import userRouter from "./modules/user/router.js";

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

  return app;
}
