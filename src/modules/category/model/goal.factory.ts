import { faker } from "@faker-js/faker";
import Factory from "@point-hub/express-factory";
import { ObjectId } from "mongodb";
import { GoalEntityInterface } from "./goal.entity.js";
import { CreateManyGoalRepository } from "./repository/create-many.repository.js";
import { CreateGoalRepository } from "./repository/create.repository.js";
import { db } from "@src/database/database.js";

export default class GoalFactory extends Factory<GoalEntityInterface> {
  async createMany(count: number) {
    const exampleRepository = new CreateManyGoalRepository(db);
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
      goal: faker.lorem.sentence(),
      images: ["image.jpg", "otherimage.jpg"],
      category_id: new ObjectId(),
      shareType: "everyone",
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async create() {
    const GoalRepository = new CreateGoalRepository(db);
    return await GoalRepository.handle(this.makeOne());
  }
}
