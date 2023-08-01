import { NextFunction, Request, Response } from "express";
import { RetrieveAllNotificationsUseCase } from "../use-case/retrieve-all-cheers.use-case.js";
import { db } from "@src/database/database.js";
import { AuthUserInterface } from "@src/middleware/auth-middleware.js";

export const readManyCheersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();
    const userCredential: AuthUserInterface = req.res?.locals.credential;
    const postId = req.query.post_id;
    const postType = req.query.postType;
    db.startTransaction();
    const retrieveAllResolutionUseCase = new RetrieveAllNotificationsUseCase(db);
    const result = await retrieveAllResolutionUseCase.handle(postId, postType, { session });

    await db.commitTransaction();

    res.status(200).json(result);
  } catch (error) {
    await db.abortTransaction();
    next(error); 
  } finally {
    await db.endSession();
  }
};