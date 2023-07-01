import request from "supertest";
import { createApp } from "../../../app.js";
import ResolutionFactory from "../model/resolution.factory.js";
import { resetDatabase } from "@src/test/utils.js";

describe("Update Resolution", () => {
  let insertedIds: string[];
  beforeAll(async () => {
    await resetDatabase();
    const resolutionFactory = new ResolutionFactory();
    const resolutions = await resolutionFactory.createMany(4);
    console.log(resolutions);
    insertedIds = resolutions.insertedIds;
  }, 60000);
  it("should update a resolution successfully", async () => {
    const resolutionId = insertedIds[0];
    const updatedResolution = {
      resolution: "Updated resolution",
      shareType: "private",
      dueDate: "2023-12-31",
    };
    console.log(typeof resolutionId);
    const app = await createApp();
    const response = await request(app).put(`/v1/resolutions/${resolutionId}`).send(updatedResolution);
    expect(response.status).toBe(204);
  });

  it("should return an error if resolution ID is invalid", async () => {
    const resolutionId = "invalid-id";
    const updatedResolution = {
      resolution: "Updated resolution",
    };

    const app = await createApp();
    const response = await request(app).put(`/v1/resolutions/${resolutionId}`).send(updatedResolution);
    expect(response.status).toBe(400);
    expect(response.body.status).toBe("Bad Request");
    // Add more assertions as needed
  });
});
