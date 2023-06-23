/* eslint-disable @typescript-eslint/no-explicit-any */
import request from "supertest";
import UserFactory from "../model/user.factory.js";
import { createApp } from "@src/app.js";
import { resetDatabase, retrieve, retrieveAll } from "@src/test/utils.js";

describe("delete an user", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  it("should be able to delete an user", async () => {
    const app = await createApp();

    const userFactory = new UserFactory();
    const resultFactory: any = await userFactory.createMany(3);

    const response = await request(app).delete(`/v1/users/${resultFactory.insertedIds[1]}`);
    console.log(response.body);

    // expect http response
    expect(response.statusCode).toEqual(204);

    // expect response json
    expect(response.body).toStrictEqual({});

    // expect recorded data
    const userRecord = await retrieve("users", resultFactory.insertedIds[1]);
    expect(userRecord).toBeNull();

    const userRecords = await retrieveAll("users");
    expect(userRecords.length).toStrictEqual(2);
  });

  it("should be return error if invalid id", async () => {
    const app = await createApp();
    const response = await request(app).delete(`/v1/users/9993f58ae548d0ca8b5f8999`);
    console.log(response.body);
    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toBe("Not Found");
  });

  it("should be return error if no id provided", async () => {
    const app = await createApp();
    const response = await request(app).delete(`/v1/users/`);
    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toBe("Not Found");
  });
});
