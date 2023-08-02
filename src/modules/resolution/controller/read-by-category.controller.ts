import { NextFunction, Request, Response } from "express";
// import { RetrieveAllResolutionUseCase } from "../use-case/retrieve-all.use-case.js";
import { RetrieveResolutionByCategoryUseCase } from "../use-case/retrieve-by-category.use-case.js";
import { db } from "@src/database/database.js";
import { AuthUserInterface } from "@src/middleware/auth-middleware.js";

export const readByCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // console.log("tes");
    const session = db.startSession();
    const userCredential: AuthUserInterface = req.res?.locals.credential;
    db.startTransaction();
    const auth = userCredential ?? "";
    const retrieveResolutionUseCase = new RetrieveResolutionByCategoryUseCase(db);
    const result = await retrieveResolutionUseCase.handle(req.params.id, auth._id, {
      session,
    });

    await db.commitTransaction();

    res.status(200).json(result);
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
