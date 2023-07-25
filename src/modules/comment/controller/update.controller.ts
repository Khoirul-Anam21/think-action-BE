import { ApiError } from "@point-hub/express-error-handler";
import { NextFunction, Request, Response } from "express";
import { db } from "@src/database/database.js";
import { AuthUserInterface } from "@src/middleware/auth-middleware.js";
import { UpdateCommentUseCase } from "../use-case/update.use-case.js"; 

export const updateController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCredential: AuthUserInterface = req.res?.locals.credential;
    const session = db.startSession();

    db.startTransaction();

    const updateCommentUseCase = new UpdateCommentUseCase(db);
    const result = await updateCommentUseCase.handle(req.params.id, { user_id: userCredential._id, ...req.body }, { session });
    if (result === undefined) throw new ApiError(404);

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
