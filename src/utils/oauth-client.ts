import { OAuth2Client } from "google-auth-library";

export default class OAuthSingleton {
  private static instance: OAuthSingleton;
  private clientInstance: OAuth2Client;

  private constructor() {
    this.clientInstance = new OAuth2Client(process.env.AUTH_CLIENT_ID, process.env.AUTH_CLIENT_SECRET);
  }

  public static getInstance(): OAuthSingleton {
    if (!OAuthSingleton.instance) {
      OAuthSingleton.instance = new OAuthSingleton();
    }
    return OAuthSingleton.instance;
  }

  public getClient(): OAuth2Client {
    return this.clientInstance;
  }
}
