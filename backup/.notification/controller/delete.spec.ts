import request from "supertest";
import { createApp } from "../../../src/app.js"; // Assuming your Express app is exported as "app"

describe("Delete API", () => {
  let supporterId: string;
  let supportingId: string;

  beforeAll(() => {
    // Add any necessary setup logic, e.g., creating test supporters and supportings in the database
  });

  afterAll(() => {
    // Add any necessary teardown logic, e.g., removing test supporters and supportings from the database
  });

  it("should delete a supporter", async () => {
    const app = await createApp();
    await request(app).delete(`v1/supporters/${supporterId}`).expect(204);
  });

  it("should delete a supporting", async () => {
    const app = await createApp();
    await request(app).delete(`v1/supportings/${supportingId}`).expect(204);
  });
});
