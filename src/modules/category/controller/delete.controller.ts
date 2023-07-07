import { NextFunction, Request, Response } from "express";
import { DeleteGoalUseCase } from "../use-case/delete.use-case.js";
import { db } from "@src/database/database.js";

export const deleteController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();
    const id = req.params.id;
    const deleteGoalUseCase = new DeleteGoalUseCase(db);
    await deleteGoalUseCase.handle(id, { session });
    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
