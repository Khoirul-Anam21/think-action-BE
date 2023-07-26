import { ApiError } from "@point-hub/express-error-handler";
import { ObjectId } from "mongodb";
import { NotificationEntity } from "../model/notification.entity.js";
import { CreateNotificationRepository } from "../model/repository/create.repository.js";
import { RetrieveAllNotificationRepository } from "../model/repository/retrieve-all.repository.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { FindPost } from "@src/utils/post-finder.js";

export class CreateNotificationUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(document: DocumentInterface, options: CreateOptionsInterface) {
    try {
      const retrieveAllNotificationRepository = new RetrieveAllNotificationRepository(this.db);
      const Notifications = await retrieveAllNotificationRepository.handle({
        fields: "",
        filter: {
          userNotificationer_id: new ObjectId(document.user_id),
          post_id: new ObjectId(document.post_id),
          postType: document.postType,
        },
        page: 1,
        pageSize: 9999,
        sort: "user_id",
      });

      console.log(Notifications);
      if (Notifications.data.length > 0) throw new ApiError(400, { msg: "You already Notificationed this post" });

      await FindPost(document.postType, document.post_id, this.db, options);

      const Notification = new NotificationEntity({
        post_id: document.post_id,
        postType: document.postType,
        userNotificationer_id: document.user_id,
        createdAt: new Date(),
      });
      const response = await new CreateNotificationRepository(this.db).handle(Notification, options);

      // TODO: Notif
      return {
        acknowledged: response.acknowledged,
        _id: response._id,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
