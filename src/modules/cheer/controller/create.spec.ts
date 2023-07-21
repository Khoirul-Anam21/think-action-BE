import { ObjectId } from "mongodb";
import request from "supertest";
import { createApp } from "../../../app.js"; // Assuming your Express app is exported as "app"
import { UserEntityInterface } from "@src/modules/user/model/user.entity.js";
import UserFactory from "@src/modules/user/model/user.factory.js";
import { resetDatabase } from "@src/test/utils.js";
import { signNewToken } from "@src/utils/jwt.js";
// import { resetDatabase } from "@src/test/utils.js";

describe("Create new supporting user", () => {
  beforeAll(async () => {
    await resetDatabase();
  });
  it("should create a new supporting", async () => {
    const userFactory = new UserFactory();
    const singleUser: UserEntityInterface = await userFactory.create();
    const userMany: any = await userFactory.createMany(4);

    const token = "Bearer " + singleUser.accessToken ?? "";

    console.log(singleUser);
    const app = await createApp();
    const response = await request(app)
      .post("v1/supports")
      .send({ supporting_id: userMany[0] })
      .set("Authorization", token);
    console.log(response.body);

    expect(response.status).toBe(201);

    expect(response.body.acknowledged).toBe(true);
  });
});
