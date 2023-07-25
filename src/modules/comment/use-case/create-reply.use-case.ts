import { ReplyEntity } from "../model/comment.entity.js";
import { validateCreateReply } from "../validation/create.validation.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { FindPost } from "@src/utils/post-finder.js";
import { CreateReplyRepository } from "../model/reply.repository/create.repository.js";

export class CreateReplyUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(document: DocumentInterface, options: CreateOptionsInterface) {
    try {
      // validate
      validateCreateReply(document);

      // init repo
      const createReplyRepository = new CreateReplyRepository(this.db);
      // await FindPost(document.postType, document.post_id, this.db, options);

      const reply = new ReplyEntity({
        comment_id: document.comment_id,
        reply_id: document.reply_id ?? null,
        user_id: document.user_id,
        comment: document.comment,
        createdAt: new Date() 
      })
      // TODO: Notif

      const response = await createReplyRepository.handle(reply, options);
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
