import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { db } from "@src/database/database.js";
import OAuthSingleton from "@src/utils/oauth-client";

export const authController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const oAuth = OAuthSingleton.getInstance();
    const client = oAuth.getClient();
    const url = client.generateAuthUrl({ scope: "profile email", access_type: "offline" });
    res.redirect(url);
  } catch (error) {
    next(error);
  }
};
