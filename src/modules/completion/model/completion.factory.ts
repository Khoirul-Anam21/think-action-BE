import { faker } from "@faker-js/faker";
import Factory from "@point-hub/express-factory";
import { ObjectId } from "mongodb";
import { CompletionEntityInterface } from "./completion.entity.js";
import { CreateManyCompletionRepository } from "./repository/create-many.repository.js";
import { CreateCompletionRepository } from "./repository/create.repository.js";
import { db } from "@src/database/database.js";

export default class CompletionFactory extends Factory<CompletionEntityInterface> {
  async createMany(count: number) {
    const exampleRepository = new CreateManyCompletionRepository(db);
    return await exampleRepository.handle(this.makeMany(count));
  }
  definition() {
    return {
      user: {
        id: new ObjectId(),
        displayName: faker.name.fullName(),
        photo: "randomhoto.jpg",
      },
      resolution_id: new ObjectId(),
      Completion: faker.lorem.sentence(),
      images: ["image.jpg", "otherimage.jpg"],
      category_id: new ObjectId(),
      shareType: "everyone",
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async create() {
    const CompletionRepository = new CreateCompletionRepository(db);
    return await CompletionRepository.handle(this.makeOne());
  }
}
