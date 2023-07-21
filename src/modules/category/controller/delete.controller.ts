import { NextFunction, Request, Response } from "express";
import { DeleteCategoryUseCase } from "../use-case/delete.use-case.js";
import { db } from "@src/database/database.js";
import { AuthUserInterface } from "@src/middleware/auth-middleware.js";

export const deleteController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCredential: AuthUserInterface = req.res?.locals.credential;
    const session = db.startSession();

    db.startTransaction();
    const id = req.params.id;
    const deleteResolutionUseCase = new DeleteCategoryUseCase(db);
    await deleteResolutionUseCase.handle(id, userCredential._id?.toString() ?? "", { session });
    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
