/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { db } from "@src/database/database.js";
import OAuthSingleton from "@src/utils/oauth-client.js";

export const authCallbackController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code: any = req.query.code;
    const oAuth = OAuthSingleton.getInstance();
    const client = oAuth.getClient();

    const { tokens }: { tokens: any } = await client.getToken(code);

    const credential = await client.verifyIdToken(tokens.id_token);
    console.log(credential);
    // const responseValue: ResponseInterface = {
    //   _id: result._id,
    // };

    // res.status(201).json(responseValue);
  } catch (error) {
    next(error);
  }
};
