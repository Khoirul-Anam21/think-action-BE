import { CommentEntity } from "../model/comment.entity.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { ApiError } from "@point-hub/express-error-handler";
import { RetrieveCommentRepository } from "../model/comment.repository/retrieve.repository.js";
import { UpdateCommentRepository } from "../model/comment.repository/update.repository.js";

export class UpdateCommentUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(id: string, document: DocumentInterface, options: CreateOptionsInterface) {
    try {
      const retrieveCommentRepository = new RetrieveCommentRepository(this.db);
      const updateCommentRepository = new UpdateCommentRepository(this.db);
      const comment = await retrieveCommentRepository.handle(id);

      if (comment.user_id === document.user_id) throw new ApiError(401, { msg: "unathorized to modify" });

      const commentData = new CommentEntity({
        comment: document.comment,
        updatedAt: new Date(),
      })
      
      await updateCommentRepository.handle(id, commentData, options);
      return {};
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
