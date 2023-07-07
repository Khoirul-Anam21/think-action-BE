import { ObjectId } from "mongodb";
import request from "supertest";
import { createApp } from "../../../app.js"; // Assuming your Express app is defined in a file called "app.js"
import UserFactory from "../model/user.factory.js";
import { resetDatabase } from "@src/test/utils.js";

describe("User Get API", () => {
  beforeAll(async () => await resetDatabase());
  it("should get user data by ID", async () => {
    const app = await createApp();
    const userFactory = new UserFactory();
    const userMock = await userFactory.create();
    console.log(userMock);
    // const userId = "user-id"; // Replace with an existing user ID

    const response = await request(app).get(`/v1/users/${userMock._id}`);
    console.log(response);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(userMock._id);
    expect(response.body.username).toBeDefined();
    expect(response.body.email).toBeDefined();
    expect(response.body.accountName).toBeDefined();
    expect(response.body.photo).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
    // expect(response.body.updatedAt).toBeDefined();
  });

  it("should return an error if user ID is invalid", async () => {
    const app = await createApp();
    const invalidUserId = "non-existing-id";

    const response = await request(app).get(`/v1/users/${invalidUserId}`);

    expect(response.status).toBe(400);
  });
  it("should return an error if user ID is not found", async () => {
    const app = await createApp();
    const userFactory = new UserFactory();
    await userFactory.create();
    const randomId = new ObjectId();

    const response = await request(app).get(`/v1/users/${randomId.toString()}`);

    expect(response.status).toBe(404);
  });
});
