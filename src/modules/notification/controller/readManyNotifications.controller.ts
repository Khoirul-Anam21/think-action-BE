import { NextFunction, Request, Response } from "express";
import { RetrieveAllNotificationsUseCase } from "../use-case/retrieve-all.use-case.js";
import { db } from "@src/database/database.js";
import { AuthUserInterface } from "@src/middleware/auth-middleware.js";

export const readManyNotificationsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();
    const userCredential: AuthUserInterface = req.res?.locals.credential;
    db.startTransaction();
    const retrieveAllResolutionUseCase = new RetrieveAllNotificationsUseCase(db);
    const result = await retrieveAllResolutionUseCase.handle(userCredential._id as string, { session });

    await db.commitTransaction();

    res.status(200).json(result);
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
