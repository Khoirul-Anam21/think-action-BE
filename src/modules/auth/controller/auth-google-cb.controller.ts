/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { AuthUseCase } from "../use-case/auth.use-case.js";
import { db } from "@src/database/database.js";
import OAuthSingleton from "@src/utils/oauth-client.js";

export const authGoogleCallbackController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code: any = req.query.code;
    const oAuth = OAuthSingleton.getInstance();
    const authUseCase = new AuthUseCase(db);
    const client = oAuth.getClient();
    const { tokens }: { tokens: any } = await client.getToken(code);
    const credential = await client.verifyIdToken({ idToken: tokens.id_token, audience: process.env.AUTH_CLIENT_ID });
    const result = await authUseCase.handle(credential.getPayload() as object);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
