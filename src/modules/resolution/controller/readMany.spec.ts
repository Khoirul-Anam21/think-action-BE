import { ObjectId } from "mongodb";
import request from "supertest";
import { createApp } from "../../../app.js"; // Assuming you have your Express app defined in a separate file
import ResolutionFactory from "../model/resolution.factory.js";
import UserFactory from "@src/modules/user/model/user.factory.js";
import { resetDatabase } from "@src/test/utils.js";
import { signNewToken } from "@src/utils/jwt.js";

describe("Get resolutions APIs", () => {
  beforeAll(async () => {
    await resetDatabase();
    const resolutionFactory = new ResolutionFactory();
    await resolutionFactory.createMany(4);
  }, 60000);
  // Test case for reading all resolutions
  describe("Get all resolutions", () => {
    it("should return all resolutions", async () => {
      const userFactory = new UserFactory();
      const resultFactory: any = await userFactory.create();

      const tokenSigned = signNewToken(
        process.env.JWT_ISSUER as string,
        process.env.JWT_SECRET as string,
        resultFactory._id
      );
      console.log(resultFactory._id);
      const token = `Bearer ${tokenSigned}`;
      // Create a mock resolution object
      const resolution = {
        // user_id: resultFactory._id, // Use an existing user ID from your database
        resolution: "My resolution",
        images: ["image1.jpg", "image2.jpg"],
        category_id: "649543776dbcf7daf089bba8",
        shareType: "public",
        dueDate: new Date(),
      };

      // Send a POST request to the create resolution endpoint
      const app = await createApp();
      await request(app).post("/v1/resolutions").set("Authorization", token).send(resolution);
      const response = await request(app).get("/v1/resolutions");
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  // Test case for reading resolutions belonging to a user
  describe("Get all resolution owned by user", () => {
    // it("should return resolutions belonging to a user", async () => {
    //   // create user example
    //   const userFactory = new UserFactory();
    //   const resultFactory: any = await userFactory.create();

    //   const tokenSigned = signNewToken(
    //     process.env.JWT_ISSUER as string,
    //     process.env.JWT_SECRET as string,
    //     resultFactory._id
    //   );
    //   const token = `Bearer ${tokenSigned}`;
    //   // Create a mock resolution object
    //   const resolution = {
    //     // user_id: resultFactory._id, // Use an existing user ID from your database
    //     resolution: "My resolution SSSSSS",
    //     images: ["image1.jpg", "image2.jpg"],
    //     category_id: "64999658b80b2d5e1c2ba81f",
    //     shareType: "public",
    //     dueDate: new Date(),
    //   };
    //   console.log("id : ");
    //   console.log(typeof resultFactory._id);

    //   // Send a POST request to the create resolution endpoint
    //   const app = await createApp();
    //   const tes = await request(app).post("/v1/resolutions").set("Authorization", token).send(resolution);
    //   console.log("hasil create ");
    //   console.log(tes.body);
    //   const response = await request(app).get("v1/resolutions/user").set("Authorization", token);
    //   console.log("All owned:");
    //   console.log(response.body);
    //   expect(response.status).toBe(200);
    //   expect(response.body).toBeDefined();
    //   expect(Array.isArray(response.body.data)).toBe(true);
    // });

    it("should return 404 if user not exist", async () => {
      const app = await createApp();
      const response = await request(app).get(`/v1/resolutions/user`);

      expect(response.status).toBe(401);
    });

    // it("should return an empty array if user has no resolutions", async () => {
    //   // create user example
    //   const userFactory = new UserFactory();
    //   const resultFactory: any = await userFactory.create();

    //   const tokenSigned = signNewToken(
    //     process.env.JWT_ISSUER as string,
    //     process.env.JWT_SECRET as string,
    //     resultFactory._id
    //   );
    //   const token = `Bearer ${tokenSigned}`;
    //   // Create a mock resolution object

    //   // Send a POST request to the create resolution endpoint
    //   const app = await createApp();

    //   const response = await request(app).get("v1/resolutions/user").set("Authorization", token);
    //   expect(response.status).toBe(200);
    //   expect(response.body).toBeDefined();
    //   expect(Array.isArray(response.body.data)).toBe(true);
    //   expect(Array.isArray(response.body.data.length)).toBe(0);
    // });
  });
});
