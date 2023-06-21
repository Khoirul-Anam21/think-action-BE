import request from "supertest";
import { createApp } from "../../../app"; // Import your Express app

describe("Authentication Callback Endpoint", () => {
  it("should handle successful authentication callback", async () => {
    const app = await createApp();
    const response = await request(app).get("/auth/callback?code=valid_auth_code").expect(200); // use oauth playground

    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("expiresIn");
    expect(response.body).toHaveProperty("refreshToken");
    expect(response.body).toHaveProperty("scope");
    // Add more assertions as needed
  });

  it("should handle authentication callback with error", async () => {
    const app = await createApp();
    const response = await request(app).get("/auth/callback?error=access_denied").expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("access_denied");
    // Add more assertions as needed
  });

  it("should handle authentication callback without authorization code", async () => {
    const app = await createApp();
    const response = await request(app).get("/auth/callback").expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("missing_code");
    // Add more assertions as needed
  });
});
