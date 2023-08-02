import { NextFunction, Request, Response } from "express";
import { RetrieveAllGoalByCategoryUseCase } from "../use-case/retrieve-all-by-category.use-case.js";
import { RetrieveAllGoalUseCase } from "../use-case/retrieve-all.use-case.js";
import { db } from "@src/database/database.js";
import { AuthUserInterface } from "@src/middleware/auth-middleware.js";

export const readManyByCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();
    const userCredential: AuthUserInterface = req.res?.locals.credential;
    db.startTransaction();
    const auth = userCredential ?? "";
    const retrieveAllGoaByCategoryUseCase = new RetrieveAllGoalByCategoryUseCase(db);
    const result = await retrieveAllGoaByCategoryUseCase.handle(req.params.id, auth._id, { session });

    await db.commitTransaction();

    res.status(200).json(result);
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
