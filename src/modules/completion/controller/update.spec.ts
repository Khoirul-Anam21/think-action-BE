import { ObjectId } from "mongodb";
import request from "supertest";
import { createApp } from "../../../app.js"; // Assuming your Express app is defined in a file called "app.js"
import ResolutionFactory from "@src/modules/resolution/model/resolution.factory.js";
import UserFactory from "@src/modules/user/model/user.factory.js";
import { resetDatabase } from "@src/test/utils.js";

describe("Update Goal API", () => {
  // let goalId: string;

  beforeEach(async () => {
    await resetDatabase();
  });

  it("should update an existing goal", async () => {
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
    const postGoal = await request(app).post("/v1/goals").send(goalData).set("Authorization", token);
    // Test case with valid updated goal data
    const updatedGoalData = {
      goal: "Updated goal",
      shareType: "private",
    };

    const response = await request(app)
      .put(`/v1/goals/${postGoal.body._id}`)
      .send(updatedGoalData)
      .set("Authorization", token);

    expect(response.status).toBe(204);
    // Assert other properties as needed
  });

  it("should return an error when invalid id", async () => {
    const userFactory = new UserFactory();
    const userMock = await userFactory.create();
    const token = "Bearer " + userMock.accessToken;
    // Test case with non-existent goal ID
    const updatedGoalData = {
      goal: "Updated goal",
      shareType: "private",
    };
    const app = await createApp();
    const response = await request(app)
      .put(`/v1/goals/non-existent-id`)
      .send(updatedGoalData)
      .set("Authorization", token);

    expect(response.status).toBe(400);
    // Assert other error properties as needed
  });

  // Add more negative test cases as needed
});
