import { DeleteCompletionRepository } from "../model/repository/delete.repository.js";
import DatabaseConnection, { DeleteOptionsInterface } from "@src/database/connection.js";
import { validateId } from "@src/utils/id-validator.js";

export class DeleteCompletionUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(id: string, options?: DeleteOptionsInterface) {
    try {
      validateId({ id });
      const deleteCompletionRepository = new DeleteCompletionRepository(this.db);
      await deleteCompletionRepository.handle(id, options);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
