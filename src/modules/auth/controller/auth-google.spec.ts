import request from "supertest";
import { createApp } from "../../../app.js"; // Assuming your Express app is exported from "app.js" file

describe("Authentication Endpoint", () => {
  it("should redirect to Google OAuth login page", async () => {
    const app = await createApp();
    const response = await request(app).get("/v1/auth/google");
    console.log(response.body);
    expect(response.statusCode).toBe(302);
    expect(response.header.location).toContain("accounts.google.com");
  });
});
