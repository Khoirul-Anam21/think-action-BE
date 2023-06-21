import express, { Express } from "express";
import authRouter from "./modules/auth/router.js";

export default function () {
  const app: Express = express();

  /**
   * Register all available modules
   * <modules>/router.ts
   */
  // app.use("/v1/examples", exampleRouter);
  app.use("/v1/auth", authRouter);

  return app;
}
