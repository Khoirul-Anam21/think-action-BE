import { ObjectId } from "mongodb";
import request from "supertest";
import { createApp } from "../../../app.js"; // Assuming your Express app is defined in a file called "app.js"
import ResolutionFactory from "@src/modules/resolution/model/resolution.factory.js";
import UserFactory from "@src/modules/user/model/user.factory.js";

describe("Delete Goal API", () => {
  let goalId: string;
  let token: string;

  beforeEach(async () => {
    const userFactory = new UserFactory();
    const userMock = await userFactory.create();
    token = "Bearer " + userMock.accessToken;
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
    const postGoal = await request(app).post("/v1/goals").send(goalData).set("Authorization", token);
    goalId = postGoal.body._id;
  });

  it("should delete a goal", async () => {
    const app = await createApp();
    const response = await request(app).delete(`/v1/goals/${goalId}`).set("Authorization", token);

    expect(response.status).toBe(204);
  });

  it("should return an error when deleting with invalid id", async () => {
    const app = await createApp();
    const response = await request(app).delete(`/v1/goals/non-existent-id`).set("Authorization", token);

    expect(response.status).toBe(400);
  });
});
