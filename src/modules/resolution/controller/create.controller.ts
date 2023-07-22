import { NextFunction, Request, Response } from "express";
import { CreateResolutionUseCase } from "../use-case/create.use-case.js";
import { db } from "@src/database/database.js";
import { AuthUserInterface } from "@src/middleware/auth-middleware.js";

export const createController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCredential: AuthUserInterface = req.res?.locals.credential;
    const session = db.startSession();

    db.startTransaction();

    const createResolutionUseCase = new CreateResolutionUseCase(db);
    const result = await createResolutionUseCase.handle({ user_id: userCredential._id, ...req.body }, req.files, {
      session,
    });

    await db.commitTransaction();

    res.status(201).json({
      _id: result._id,
      acknowledged: result.acknowledged,
    });
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
