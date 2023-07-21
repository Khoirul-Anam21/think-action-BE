import request from "supertest";
import { createApp } from "../../../app.js";
import UserFactory from "@src/modules/user/model/user.factory.js";
import { resetDatabase } from "@src/test/utils.js";
import { signNewToken } from "@src/utils/jwt.js";

describe("Create Category", () => {
  beforeAll(async () => {
    await resetDatabase();
  });
  test("Should create a new category for a user", async () => {
    // create user example
    const userFactory = new UserFactory();
    const resultFactory: any = await userFactory.create();

    const tokenSigned = signNewToken(
      process.env.JWT_ISSUER as string,
      process.env.JWT_SECRET as string,
      resultFactory._id
    );
    const token = `Bearer ${tokenSigned}`;

    const app = await createApp();
    const response = await request(app)
      .post(`/v1/categories`)
      .send({ category: "New Category" })
      .set("Authorization", token);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
  });

  test("Should return 401 if user invalid / unauthorized", async () => {
    // const invalidUserId = "INVALID_USER_ID";
    const app = await createApp();
    const response = await request(app).post(`/v1/categories`).send({ category: "New Category" });

    expect(response.status).toBe(401);
  });
});
