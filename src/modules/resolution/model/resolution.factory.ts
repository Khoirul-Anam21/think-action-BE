import { faker } from "@faker-js/faker";
import Factory from "@point-hub/express-factory";
import { ObjectId } from "mongodb";
import { CreateManyResolutionRepository } from "./repository/create-many.repository.js";
import { CreateResolutionRepository } from "./repository/create.repository.js";
import { ResolutionEntityInterface } from "./resolution.entity.js";
import { db } from "@src/database/database.js";

export default class ResolutionFactory extends Factory<ResolutionEntityInterface> {
  async createMany(count: number) {
    const exampleRepository = new CreateManyResolutionRepository(db);
    return await exampleRepository.handle(this.makeMany(count));
  }
  definition() {
    return {
      user: {
        displayName: faker.name.fullName(),
        photo: "randomhoto.jpg",
      },
      resolution: faker.lorem.sentence(),
      images: ["image.jpg", "otherimage.jpg"],
      category_id: new ObjectId(),
      shareType: "everyone",
      completed: false,
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async create() {
    const ResolutionRepository = new CreateResolutionRepository(db);
    return await ResolutionRepository.handle(this.makeOne());
  }
}
