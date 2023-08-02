import { NextFunction, Request, Response } from "express";
import { RetrieveMonthlyReportUseCase } from "../use-case/retrieve-monthly.use-case.js";
import { RetrieveYearlyReportUseCase } from "../use-case/retrieve-yearly.use-case.js";
import { db } from "@src/database/database.js";
import { AuthUserInterface } from "@src/middleware/auth-middleware.js";

export const readMonthlyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();
    const userCredential: AuthUserInterface = req.res?.locals.credential;
    const postId = req.query.post_id;
    const postType = req.query.postType;
    db.startTransaction();
    const retrieveMonthlyReportUseCase = new RetrieveMonthlyReportUseCase(db);
    const result = await retrieveMonthlyReportUseCase.handle(
      userCredential._id as string,
      Number(req.params.year),
      Number(req.params.month),
      {
        session,
      }
    );

    await db.commitTransaction();

    res.status(200).json(result);
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
