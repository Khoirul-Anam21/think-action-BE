import { NextFunction, Request, Response } from "express";
import { RetrieveAllSupporterUseCase } from "../use-case/retrieve-supporter.use-case.js";
import { db } from "@src/database/database.js";
import { AuthUserInterface } from "@src/middleware/auth-middleware.js";

export const readManySupporterController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();
    const userCredential: AuthUserInterface = req.res?.locals.credential;
    db.startTransaction();
    const auth = userCredential ?? "";
    const retrieveAllResolutionUseCase = new RetrieveAllSupporterUseCase(db);
    const result = await retrieveAllResolutionUseCase.handle(auth._id, { session });

    await db.commitTransaction();

    res.status(200).json(result);
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
