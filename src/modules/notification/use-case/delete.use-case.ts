// import { DeleteResolutionRepository } from "../model/supporter/repository/delete.repository.js";
import { DeleteCheerRepository } from "../model/repository/delete.repository.js";
import DatabaseConnection, { DeleteOptionsInterface } from "@src/database/connection.js";
import { validateId } from "@src/utils/id-validator.js";

export class DeleteCheerUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(id: string, options?: DeleteOptionsInterface) {
    try {
      validateId({ id });

      const deleteResolutionRepository = new DeleteCheerRepository(this.db);
      await deleteResolutionRepository.handle(id, options);
      return {};
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
