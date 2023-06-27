import nock from "nock";
import request from "supertest";
import { createApp } from "../../../app.js"; // Import your Express app

describe("Authentication Callback Endpoint", () => {
  let googleUrl: string;
  it("should redirect to Google OAuth login page", async () => {
    const app = await createApp();
    const response = await request(app).get("/v1/auth/google");
    console.log(response.header.location);
    expect(response.statusCode).toBe(302);
    expect(response.header.location).toContain("accounts.google.com");
    googleUrl = response.header.location;
  });
});
