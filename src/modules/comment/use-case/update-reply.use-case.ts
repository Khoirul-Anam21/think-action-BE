import { ObjectId } from "mongodb";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { FindPost } from "@src/utils/post-finder.js";
import { ApiError } from "@point-hub/express-error-handler";
import { RetrieveAllReplyRepository } from "../model/reply.repository/retrieve-all.repository.js";
import { RetrieveReplyRepository } from "../model/reply.repository/retrieve.repository.js";
import { UpdateReplyRepository } from "../model/reply.repository/update.repository.js";
import { ReplyEntity } from "../model/comment.entity.js";

export class UpdateReplyUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(id: string, document: DocumentInterface, options: CreateOptionsInterface) {
    try {
      const retrieveReplyRepository = new RetrieveReplyRepository(this.db);
      const updateReplyRepository = new UpdateReplyRepository(this.db);
      const reply = await retrieveReplyRepository.handle(id);

      if (reply.user_id === document.user_id) throw new ApiError(401, { msg: "unathorized to modify" });

      const replyData = new ReplyEntity({
        comment: document.comment,
        updatedAt: new Date(),
      })
      
      await updateReplyRepository.handle(id, replyData, options);
      return {}
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
