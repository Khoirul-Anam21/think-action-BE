import { ObjectId } from "mongodb";
import { RetrieveAllNotificationRepository } from "../model/repository/retrieve-all.repository.js";
// import { validateReadManyNotifications } from "../validation/raeadMany.validation.js";
import DatabaseConnection, { RetrieveAllOptionsInterface } from "@src/database/connection.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";

export class RetrieveAllNotificationsUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(post_id: any, postType: any, options?: RetrieveAllOptionsInterface, page = 1, limit = 10) {
    try {
      // console.log(typeof user_id);
      // validateReadManyNotifications({ post_id, postType });
      const retrieveAllNotificationRepository = new RetrieveAllNotificationRepository(this.db);
      const result = await retrieveAllNotificationRepository.handle(
        {
          fields: "",
          filter: { post_id: new ObjectId(post_id), postType },
          page: 1,
          pageSize: 999,
          sort: "user_id",
        },
        options
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}
