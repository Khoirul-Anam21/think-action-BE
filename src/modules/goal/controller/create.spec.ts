import { ObjectId } from "mongodb";
import request from "supertest";
import { createApp } from "../../../app.js";
import UserFactory from "@src/modules/user/model/user.factory.js";
import { resetDatabase } from "@src/test/utils.js";
import { signNewToken } from "@src/utils/jwt.js";
// jest.useFakeTimers();

describe("Resolution API - Create Resolution", () => {
  // let user;

  // beforeAll(async () => {
  //   // const userId = "user123";
  //   // user = await getUserById(userId);
  //   await resetDatabase();
  // });

  it("should create a new resolution", async () => {
    // create user example
    const userFactory = new UserFactory();
    const resultFactory: any = await userFactory.create();

    const tokenSigned = signNewToken(
      process.env.JWT_ISSUER as string,
      process.env.JWT_SECRET as string,
      resultFactory._id
    );
    const token = `Bearer ${tokenSigned}`;
    // Create a mock resolution object
    const resolution = {
      // user_id: resultFactory._id, // Use an existing user ID from your database
      resolution: "My resolution",
      images: ["image1.jpg", "image2.jpg"],
      category_id: new ObjectId(),
      shareType: "public",
      dueDate: new Date(),
    };
    console.log(resultFactory);

    // Send a POST request to the create resolution endpoint
    const app = await createApp();
    const response = await request(app).post("/v1/resolutions").set("Authorization", token).send(resolution);
    console.log(response.body);
    // Verify the response
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("acknowledged");
  }, 8000);

  it("should return an error unauthorized if no token provided", async () => {
    // Create a mock resolution object with invalid user ID
    const resolution = {
      resolution: "My resolution",
      images: ["image1.jpg", "image2.jpg"],
      category_id: new ObjectId(),
      shareType: "public",
      dueDate: new Date(),
    };

    // Send a POST request to the create resolution endpoint
    const app = await createApp();
    const response = await request(app).post("/v1/resolutions").send(resolution);
    console.log(response.body);
    // Verify the response
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("status", "Unauthorized");
  });
});
