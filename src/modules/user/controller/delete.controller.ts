import { NextFunction, Request, Response } from "express";
import { DeleteUserUseCase } from "../use-case/delete.use-case.js";
import { db } from "@src/database/database.js";

export const deleteController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();
    const id = req.params.id;
    const deleteUserUseCase = new DeleteUserUseCase(db);
    await deleteUserUseCase.handle(id, { session });
    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
