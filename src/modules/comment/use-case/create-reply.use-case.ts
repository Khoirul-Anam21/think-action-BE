import { ApiError } from "@point-hub/express-error-handler";
import { CommentReplyEntity } from "../model/comment.entity.js";
import { CreateCommentReplyRepository } from "../model/repository/create.repository.js";
import { RetrieveCommentRepository } from "../model/repository/retrieve.repository.js";
import { validateCreateCommentReply } from "../validation/create.validation.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { CreateNotificationUseCase } from "@src/modules/notification/use-case/create.use-case.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";

export class CreateCommentReplyUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(document: DocumentInterface, options: CreateOptionsInterface) {
    try {
      validateCreateCommentReply(document);
      const retrieveUserRepository = new RetrieveUserRepository(this.db);
      const retrieveCommentRepository = new RetrieveCommentRepository(this.db);
      const user = await retrieveUserRepository.handle(document.user_id);
      const commentFind = await retrieveCommentRepository.handle(document.comment_id);

      if (!user) throw new ApiError(404, { msg: "user not found" });
      if (!commentFind) throw new ApiError(404, { msg: "comment not found" });

      const reply = new CommentReplyEntity({
        user_id: document.user_id,
        comment_id: document.comment_id,
        reply_id: document.reply_id ?? null,
        comment: document.comment,
        createdAt: new Date(),
      });
      const response = await new CreateCommentReplyRepository(this.db).handle(reply, options);
      // Notif
      const createNotificationUseCase = new CreateNotificationUseCase(this.db);
      await createNotificationUseCase.handle(
        {
          user_id: document.user_id,
          post_id: commentFind.post_id,
          postType: commentFind.postType,
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
