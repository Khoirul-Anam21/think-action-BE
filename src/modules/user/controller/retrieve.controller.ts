import { NextFunction, Request, Response } from "express";
import { RetrieveUserUseCase } from "../use-case/retrieve.use-case.js";
import { db } from "@src/database/database.js";
import { AuthUserInterface } from "@src/middleware/auth-middleware.js";

export const retrieveController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCredential: AuthUserInterface = req.res?.locals.credential;
    const session = db.startSession();

    db.startTransaction();

    const retrieveUserUseCase = new RetrieveUserUseCase(db);
    const result = await retrieveUserUseCase.handle(req.params.id, userCredential._id, { session });

    await db.commitTransaction();

    res.status(200).json(result);
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
