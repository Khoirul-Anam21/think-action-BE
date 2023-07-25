import DatabaseConnection, { DeleteOptionsInterface } from "@src/database/connection.js";
import { validateId } from "@src/utils/id-validator.js";
import { DeleteReplyRepository } from "../model/reply.repository/delete.repository.js";

export class DeleteReplyUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(id: string, options?: DeleteOptionsInterface) {
    try {
      validateId({ id });

      const deleteResolutionRepository = new DeleteReplyRepository(this.db);
      await deleteResolutionRepository.handle(id, options);
      return {};
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
