import { NotificationEntity, NotificationRequest } from "../model/notification.entity.js";
import { CreateNotificationRepository } from "../model/repository/create.repository.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";
import { FindPost } from "@src/utils/post-finder.js";

export class CreateNotificationUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(document: NotificationRequest, options: CreateOptionsInterface) {
    try {
      const createNotificationRepository = new CreateNotificationRepository(this.db);
      let message;
      // let postId;
      if (document.post_id && document.postType) {
        const post = await FindPost(document.postType, document.post_id, this.db, options);
        const user = post.user.accountName;
        switch (document.messageType) {
          case "cheer":
            message = user + " cheered you";
            break;
          case "comment":
            message = user + " commented on your goal ";
          default:
            break;
        }
        const notification = new NotificationEntity({
          user_id: document.user_id,
          post_id: document.post_id,
          postType: document.postType,
          userNotified_id: post.user.id,
          message,
          read: false,
        });
        const result = await createNotificationRepository.handle(notification, options);
        return {
          id: result._id,
          acknowledged: result.acknowledged,
        };
      }
      const retrieveUserRepository = new RetrieveUserRepository(this.db);
      const user = await retrieveUserRepository.handle(document.user_id);
      const notification = new NotificationEntity({
        user_id: document.user_id,
        userNotified_id: document.userNotified,
        message: user.accountName + " requested to support you",
        read: false,
      });
      const result = await createNotificationRepository.handle(notification, options);
      return {
        id: result._id,
        acknowledged: result.acknowledged,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
