import nock from "nock";
import request from "supertest";
import { createApp } from "../../../app.js"; // Import your Express app

describe("Authentication Callback Endpoint", () => {
  let code: string;
  beforeAll(() => {
    // Mock the Google OAuth endpoint to return a valid authorization code
    const mockReq = nock("https://accounts.google.com").post("/o/oauth2/token").reply(200, {
      access_token: "mock_access_token",
      refresh_token: "mock_refresh_token",
      expires_in: 3600,
      scope: "profile email",
    });
    console.log(mockReq);
  });
  it("should handle successful authentication callback", async () => {
    const app = await createApp();
    const response = await request(app)
      .get("/auth/google-cb?code=4%2F0AbUR2VPBtpFFL6BlgrBCBhOmIKQoqhphOaj6qDiQGTn0YWQ-U5zQwHHmmecoDK9Ea9ddfA")
      .expect(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("expiresIn");
    expect(response.body).toHaveProperty("refreshToken");
    expect(response.body).toHaveProperty("scope");
    // Add more assertions as needed
  });
  it("should handle authentication callback with error", async () => {
    const app = await createApp();
    const response = await request(app).get("/v1/auth/google-cb?error=access_denied").expect(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("access_denied");
    // Add more assertions as needed
  });

  it("should handle authentication callback without authorization code", async () => {
    const app = await createApp();
    const response = await request(app).get("/v1/auth/google-cb").expect(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("missing_code");
    // Add more assertions as needed
  });
});
