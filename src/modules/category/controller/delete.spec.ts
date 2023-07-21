import { ObjectId } from "mongodb";
import request from "supertest";
import { createApp } from "../../../app.js";
import { CategoryFactory } from "../model/category.factory.js";
import { resetDatabase } from "@src/test/utils.js";

describe("Delete Category", () => {
  beforeAll(async () => {
    await resetDatabase();
  });
  test("Should delete a category for a user", async () => {
    // create user example
    const categoryFactory = new CategoryFactory();
    const categories = await categoryFactory.createMany(4);
    const token = `Bearer ${categories.token}`;
    console.log(categories);
    console.log(categories.insertedIds[0]);
    const app = await createApp();
    const response = await request(app)
      .delete(`/v1/categories/${categories.insertedIds[0]}`)
      .set("Authorization", token);
    console.log(response.body);
    expect(response.status).toBe(204);
  });

  test("Should return 404 if category ID is invalid", async () => {
    const randomCategoryId = new ObjectId(); // Replace with the actual category ID
    const categoryFactory = new CategoryFactory();
    const category = await categoryFactory.create();
    const token = `Bearer ${category.token}`;

    const app = await createApp();
    const response = await request(app)
      .delete(`/v1/categories/${randomCategoryId.toString()}`)
      .set("Authorization", token);

    expect(response.status).toBe(404);
  });

  test("Should return 401 if user is invalid", async () => {
    const categoryFactory = new CategoryFactory();
    const category = await categoryFactory.create();
    // const token = `Bearer ${category.token}`;

    const app = await createApp();
    const response = await request(app).delete(`/v1/categories/${category.id?.toString()}`);

    expect(response.status).toBe(401);
  });
});
