import { ApiError } from "@point-hub/express-error-handler";
import { ObjectId } from "mongodb";
import { CommentEntity } from "../model/comment.entity.js";
import { CreateCommentRepository } from "../model/repository/create.repository.js";
import { validateCreateComment } from "../validation/create.validation.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { CreateNotificationUseCase } from "@src/modules/notification/use-case/create.use-case.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";
import { FindPost } from "@src/utils/post-finder.js";

export class CreateCommentUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(document: DocumentInterface, options: CreateOptionsInterface) {
    try {
      validateCreateComment(document);
      console.log("Hai bang");
      const retrieveUserRepository = new RetrieveUserRepository(this.db);
      const user = await retrieveUserRepository.handle(document.user_id);
      if (!user) throw new ApiError(404, { msg: "user not found" });

      const post = await FindPost(document.postType, document.post_id, this.db, options);

      const comment = new CommentEntity({
        user_id: document.user_id,
        post_id: document.post_id,
        postType: document.postType,
        comment: document.comment,
        createdAt: new Date(),
      });
      const response = await new CreateCommentRepository(this.db).handle(comment, options);

      // Notif
      const createNotificationUseCase = new CreateNotificationUseCase(this.db);
      await createNotificationUseCase.handle(
        {
          user_id: document.user_id,
          post_id: document.post_id,
          postType: post.postType,
          messageType: "comment",
        },
        options
      );
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
