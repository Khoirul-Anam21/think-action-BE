import request from "supertest";
import { createApp } from "../../../app.js";
import ResolutionFactory from "../model/goal.factory.js";
import { resetDatabase } from "@src/test/utils.js";

describe("Delete Resolution", () => {
  let insertedIds: string[];
  beforeAll(async () => {
    await resetDatabase();
    const resolutionFactory = new ResolutionFactory();
    const resolutions = await resolutionFactory.createMany(4);
    insertedIds = resolutions.insertedIds;
  }, 60000);

  it("should delete a resolution successfully", async () => {
    const resolutionId = insertedIds[0];
    const app = await createApp();
    const response = await request(app).delete(`/v1/resolutions/${resolutionId}`);
    expect(response.status).toBe(204);
    // Add more assertions as needed
  });

  it("should return an error if resolution ID is invalid", async () => {
    const resolutionId = "invalid-id";

    const app = await createApp();
    const response = await request(app).delete(`/v1/resolutions/${resolutionId}`);
    expect(response.status).toBe(400);

    expect(response.body.status).toBe("Bad Request");
    // Add more assertions as needed
  });
});
