import { NextFunction, Request, Response } from "express";
import { UpdateReadNotificationUseCase } from "../use-case/update-read.use-case.js";
import { db } from "@src/database/database.js";
import { AuthUserInterface } from "@src/middleware/auth-middleware.js";

export const updateReadController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCredential: AuthUserInterface = req.res?.locals.credential;
    const session = db.startSession();

    db.startTransaction();
    const updateReadNotificationUseCase = new UpdateReadNotificationUseCase(db);
    await updateReadNotificationUseCase.handle({ user_id: userCredential._id as string }, { session });
    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    console.log(error);
    next(error);
  } finally {
    await db.endSession();
  }
};
