import { faker } from "@faker-js/faker";
import Factory from "@point-hub/express-factory";
import { ObjectId } from "mongodb";
import { CreateManySupportingRepository } from "./repository/create-many.repository.js";
import { CreateSupportingRepository } from "./repository/create.repository.js";
import { SupportingEntityInterface } from "./support.entity.js";
import { db } from "@src/database/database.js";

export class SupportingFactory extends Factory<SupportingEntityInterface> {
  async createMany(count: number) {
    const supportingRepository = new CreateManySupportingRepository(db);
    return await supportingRepository.handle(this.makeMany(count));
  }
  definition() {
    return {
      user_id: new ObjectId().toString(),
      supporting: {
        id: new ObjectId(),
        displayName: faker.name.fullName(),
        photo: "randomhoto.jpg",
      },
    };
  }

  async create() {
    const supportingRepository = new CreateSupportingRepository(db);
    return await supportingRepository.handle(this.makeOne());
  }
}
