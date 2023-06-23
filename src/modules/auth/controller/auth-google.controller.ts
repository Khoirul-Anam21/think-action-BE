/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import OAuthSingleton from "@src/utils/oauth-client.js";

export const authGoogleController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const oAuth = OAuthSingleton.getInstance();
    const client = oAuth.getClient();
    const authUrl = client.generateAuthUrl({
      access_type: "offline", // To request refresh token
      scope: "profile email", // Specify the required scopes
    }); //
    // Redirect the user to the generated auth URL
    res.redirect(authUrl);
  } catch (error) {
    console.log("err" + error);
    next(error);
  }
};
