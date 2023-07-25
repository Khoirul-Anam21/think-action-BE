import { ObjectId } from "mongodb";
import request from "supertest";
import { createApp } from "../../../app.js"; // Assuming your Express app is defined in a file called "app.js"
import ResolutionFactory from "@src/modules/resolution/model/resolution.factory.js";
import UserFactory from "@src/modules/user/model/user.factory.js";
import { resetDatabase } from "@src/test/utils.js";

describe("Goal Create API", () => {
  beforeAll(async () => await resetDatabase());
  it("should create a new goal", async () => {
    const userFactory = new UserFactory();
    const userMock = await userFactory.create();
    const token = "Bearer " + userMock.accessToken;
    const category_id = new ObjectId();
    const resolutionFactory = new ResolutionFactory();
    const resolutionMock = await resolutionFactory.create();
    const goalData = {
      resolution_id: resolutionMock._id, // Replace with an existing resolution ID
      goal: "My goal",
      images: ["image1.jpg", "image2.jpg"],
      category_id, // Replace with an existing category ID
      shareType: "public",
      dueDate: "2023-12-31",
    };
    const app = await createApp();
    const response = await request(app).post("/v1/goals").send(goalData).set("Authorization", token);

    expect(response.status).toBe(201);
    expect(response.body._id).toBeDefined();
  });

  it("should return an error if required fields are missing", async () => {
    const userFactory = new UserFactory();
    const userMock = await userFactory.create();
    const token = "Bearer " + userMock.accessToken;
    const goalData = {
      // Missing required fields
    };
    const app = await createApp();
    const response = await request(app).post("/v1/goals").send(goalData).set("Authorization", token);

    expect(response.status).toBe(422);
  });
});
