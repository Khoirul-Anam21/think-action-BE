import { CommentEntity } from "../model/comment.entity.js";
import { validateCreateComment } from "../validation/create.validation.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { FindPost } from "@src/utils/post-finder.js";
import { CreateCommentRepository } from "../model/comment.repository/create.repository.js";

export class CreateCommentUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(document: DocumentInterface, options: CreateOptionsInterface) {
    try {
      // validate
      validateCreateComment(document);

      // init repo
      const createCommentRepository = new CreateCommentRepository(this.db);
      await FindPost(document.postType, document.post_id, this.db, options);

      const comment = new CommentEntity({
        post_id: document.post_id,
        postType: document.postType,
        user_id: document.user_id,
        comment: document.comment,
        createdAt: new Date() 
      })
      // TODO: Notif

      const response = await createCommentRepository.handle(comment, options);
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
