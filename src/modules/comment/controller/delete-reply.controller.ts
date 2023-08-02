import { NextFunction, Request, Response } from "express";
import { db } from "@src/database/database.js";
import { DeleteReplyUseCase } from "../use-case/delete-reply.use-case.js";

export const deleteReplyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();
    const id = req.params.id;
    const deleteReplyUseCase = new DeleteReplyUseCase(db);
    await deleteReplyUseCase.handle(id, { session });
    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
