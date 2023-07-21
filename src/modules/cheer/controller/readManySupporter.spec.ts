import request from "supertest";
import app from "../app"; // Assuming your Express app is exported as "app"

describe("Read API", () => {
  let supporterId: string;
  let supportingId: string;

  beforeAll(() => {
    // Add any necessary setup logic, e.g., creating test supporters and supportings in the database
  });

  afterAll(() => {
    // Add any necessary teardown logic, e.g., removing test supporters and supportings from the database
  });

  it("should get all supporters", async () => {
    const response = await request(app).get("/supporters").expect(200);

    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a specific supporter by ID", async () => {
    await request(app).get(`/supporters/${supporterId}`).expect(200);
  });

  it("should get all supportings", async () => {
    const response = await request(app).get("/supportings").expect(200);

    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a specific supporting by ID", async () => {
    await request(app).get(`/supportings/${supportingId}`).expect(200);
  });
});
