import { ApiError } from "@point-hub/express-error-handler";
import { NextFunction, Request, Response } from "express";
import { CreateCommentReplyUseCase } from "../use-case/create-reply.use-case.js";
import { db } from "@src/database/database.js";
import { AuthUserInterface } from "@src/middleware/auth-middleware.js";

export const createReplyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCredential: AuthUserInterface = req.res?.locals.credential;
    const session = db.startSession();

    db.startTransaction();

    const createSupportingUseCase = new CreateCommentReplyUseCase(db);
    const result = await createSupportingUseCase.handle({ user_id: userCredential._id, ...req.body }, { session });

    await db.commitTransaction();

    res.status(201).json({
      _id: result._id,
      acknowledged: result.acknowledged,
    });
  } catch (error) {
    await db.abortTransaction();
    console.log(error);
    next(error);
  } finally {
    await db.endSession();
  }
};
