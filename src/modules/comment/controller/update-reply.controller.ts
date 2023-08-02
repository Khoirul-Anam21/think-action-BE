import { ApiError } from "@point-hub/express-error-handler";
import { NextFunction, Request, Response } from "express";
import { db } from "@src/database/database.js";
import { AuthUserInterface } from "@src/middleware/auth-middleware.js";
import { UpdateReplyUseCase } from "../use-case/update-reply.use-case.js";

export const updateReplyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCredential: AuthUserInterface = req.res?.locals.credential;
    const session = db.startSession();

    db.startTransaction();

    const updateReplyUseCase = new UpdateReplyUseCase(db);
    const result = await updateReplyUseCase.handle( req.params.id ,{ user_id: userCredential._id, ...req.body }, { session });
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
