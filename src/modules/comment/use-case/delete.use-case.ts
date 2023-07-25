import DatabaseConnection, { DeleteOptionsInterface } from "@src/database/connection.js";
import { validateId } from "@src/utils/id-validator.js";
import { DeleteCommentRepository } from "../model/comment.repository/delete.repository.js";

export class DeleteCommentUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(id: string, options?: DeleteOptionsInterface) {
    try {
      validateId({ id });

      const deleteResolutionRepository = new DeleteCommentRepository(this.db);
      await deleteResolutionRepository.handle(id, options);
      return {};
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
