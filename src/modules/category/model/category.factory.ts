import { faker } from "@faker-js/faker";
import Factory from "@point-hub/express-factory";
import { ObjectId } from "mongodb";
import { CategoryEntityInterface } from "./category.entity.js";
import { db } from "@src/database/database.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";
import { UpdateUserRepository } from "@src/modules/user/model/repository/update.repository.js";
import UserFactory from "@src/modules/user/model/user.factory.js";

export class CategoryFactory extends Factory<CategoryEntityInterface> {
  async createMany(count: number) {
    const userFactory = new UserFactory();
    const user = await userFactory.create();
    const updateUserRepository = new UpdateUserRepository(db);
    const retrieveUserRepository = new RetrieveUserRepository(db);
    await updateUserRepository.handle(user._id, { categories: [...this.makeMany(count)] });

    const userData = await retrieveUserRepository.handle(user._id);
    const insertedIds = userData.categories?.map((category) => category._id) ?? [];

    return { token: user.accessToken, insertedIds };
  }
  definition() {
    const objectId = new ObjectId();
    return {
      _id: objectId.toString(),
      category: faker.word.noun(),
    };
  }

  async create() {
    const userFactory = new UserFactory();
    const user = await userFactory.create();
    const retrieveUserRepository = new RetrieveUserRepository(db);
    const updateUserRepository = new UpdateUserRepository(db);
    await updateUserRepository.handle(user._id, { categories: [this.makeOne()] });
    const userData: any = await retrieveUserRepository.handle(user._id);

    return { token: user.accessToken, id: userData.categories[0]._id };
  }
}
