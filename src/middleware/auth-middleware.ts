import { ApiError } from "@point-hub/express-error-handler";
import { NextFunction, Request, Response } from "express";
import { db } from "@src/database/database.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";
import { UserEntityInterface } from "@src/modules/user/model/user.entity.js";
import { RetrieveUserUseCase } from "@src/modules/user/use-case/retrieve.use-case.js";
import { verifyToken } from "@src/utils/jwt.js";

export interface AuthUserInterface {
  _id?: string;
  username?: string;
  email?: string;
}

export const authorizeToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization ?? "";

    if (authorizationHeader === "") {
      res.status(401).json({ msg: "missing token" });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token: any = verifyToken(authorizationHeader.split(" ")[1], process.env.JWT_SECRET as string);

    // token invalid
    if (!token) {
      res.status(401).json({ msg: "invalid token" });
    }

    // token expired
    if (new Date() > token.exp) {
      res.status(401).json({ msg: "token expired" });
    }

    // const readAllUserUseCase = new RetrieveUserUseCase(db);
    const readManyUserRepository = new RetrieveUserRepository(db);
    const user: UserEntityInterface = await readManyUserRepository.handle(token.sub);
    const result: AuthUserInterface = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    res.locals.credential = result;

    return next();
  } catch (error) {
    next(error);
  }
};
