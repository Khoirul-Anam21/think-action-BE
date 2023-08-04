import { ApiError } from "@point-hub/express-error-handler";
import { ObjectId } from "mongodb";
import { RetrieveAllNotificationRepository } from "../model/repository/retrieve-all.repository.js";
import { UpdateManyNotificationRepository } from "../model/repository/update-many.repository.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";

export class UpdateReadNotificationUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(document: DocumentInterface, options: CreateOptionsInterface) {
    try {
      const retrieveAllNotificationRepository = new RetrieveAllNotificationRepository(this.db);
      const updateManyNotificationRepository = new UpdateManyNotificationRepository(this.db);
      const notifications: any = await retrieveAllNotificationRepository.handle({
        fields: "",
        filter: {
          userNotified_id: new ObjectId(document.user_id),
        },
        page: 1,
        pageSize: 9999,
        sort: "user_id",
      });
      if (!notifications.data) throw new ApiError(404, { msg: "notifications not found" });
      await updateManyNotificationRepository.handle(
        { user_id: new ObjectId(document.user_id), read: false },
        { $set: { read: true, updatedAt: new Date() } },
        options
      );
      return {};
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
