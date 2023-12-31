/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from "@faker-js/faker";
import { isValid } from "date-fns";
import request from "supertest";
import UserFactory from "../model/user.factory.js";
import { createApp } from "@src/app.js";
import { resetDatabase, retrieve, retrieveAll } from "@src/test/utils.js";

describe("update an user", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  it("should be able to update a user", async () => {
    const app = await createApp();

    const resultFactory: any = await new UserFactory().createMany(3);

    const data = await retrieveAll("users");

    const updateData = {
      accountName: faker.name.fullName(),
    };

    const response = await request(app).patch(`/v1/users/${resultFactory.insertedIds[1]}`).send(updateData);
    console.log(response);
    // expect http response
    expect(response.statusCode).toEqual(204);

    // expect response json
    expect(response.body).toStrictEqual({});

    // expect recorded data
    const userRecord = await retrieve("users", resultFactory.insertedIds[1]);
    expect(userRecord.accountName).toStrictEqual(updateData.accountName);
    expect(isValid(new Date(userRecord.updatedAt))).toBeTruthy();

    // expect another data unmodified
    const unmodifiedUserRecord = await retrieve("users", resultFactory.insertedIds[0]);
    expect(unmodifiedUserRecord.accountName).toStrictEqual(data[0].accountName);
    expect(unmodifiedUserRecord.updatedAt).toBeUndefined();
  });

  it("should be return error if invalid id", async () => {
    const app = await createApp();
    const updateData = {
      accountName: faker.name.fullName(),
    };
    const response = await request(app).patch(`/v1/users/9993f58ae548d0ca8b5f8999`).send(updateData);
    expect(response.statusCode).toEqual(422);
    expect(response.body.status).toBe("Unprocessable Entity");
  });

  it("should be return error if no id provided", async () => {
    const app = await createApp();
    const updateData = {
      accountName: faker.name.fullName(),
    };
    const response = await request(app).patch(`/v1/users/`).send(updateData);
    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toBe("Not Found");
  });
});
