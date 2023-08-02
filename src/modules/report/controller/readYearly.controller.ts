import { NextFunction, Request, Response } from "express";
import { RetrieveYearlyReportUseCase } from "../use-case/retrieve-yearly.use-case.js";
import { db } from "@src/database/database.js";
import { AuthUserInterface } from "@src/middleware/auth-middleware.js";

export const readYearlyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCredential: AuthUserInterface = req.res?.locals.credential;
    db.startTransaction();
    const retrieveYearlyReportUseCase = new RetrieveYearlyReportUseCase(db);
    const result = await retrieveYearlyReportUseCase.handle(userCredential._id as string, Number(req.params.year));

    await db.commitTransaction();

    res.status(200).json(result);
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
