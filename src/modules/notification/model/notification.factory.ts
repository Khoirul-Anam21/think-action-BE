import { faker } from "@faker-js/faker";
import Factory from "@point-hub/express-factory";
import { ObjectId } from "mongodb";
import { NotificationEntityInterface } from "./notification.entity.js";
import { CreateManyNotificationRepository } from "./repository/create-many.repository.js";
import { CreateNotificationRepository } from "./repository/create.repository.js";
import { db } from "@src/database/database.js";

export class CheerFactory extends Factory<NotificationEntityInterface> {
  async createMany(count: number) {
    const cheerRepository = new CreateManyNotificationRepository(db);
    return await cheerRepository.handle(this.makeMany(count));
  }
  definition() {
    return {
      userCheerer_id: new ObjectId(),
      post_id: new ObjectId(),
      postType: "resolution",
    };
  }

  async create() {
    const cheerRepository = new CreateNotificationRepository(db);
    return await cheerRepository.handle(this.makeOne());
  }
}
