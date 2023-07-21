import request from "supertest";
import { createApp } from "../../../app.js";
import { CategoryFactory } from "../model/category.factory.js";
import UserFactory from "@src/modules/user/model/user.factory.js";
import { resetDatabase } from "@src/test/utils.js";
import { signNewToken } from "@src/utils/jwt.js";

describe("Read Categories", () => {
  beforeAll(async () => {
    await resetDatabase();
  });

  test("Should retrieve all categories for a user", async () => {
    // create user example
    const categoryFactory = new CategoryFactory();
    const categories = await categoryFactory.createMany(4);
    const token = `Bearer ${categories.token}`;
    console.log(token);
    const app = await createApp();
    const response = await request(app).get(`/v1/categories`).set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test("Should return 404 if user / unauthorized", async () => {
    const invalidUserId = "INVALID_USER_ID";

    const app = await createApp();
    const response = await request(app).get(`/v1/categories`);

    expect(response.status).toBe(401);
  });
});
