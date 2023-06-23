import { DeleteUserRepository } from "../model/repository/delete.repository.js";
import { RetrieveUserRepository } from "../model/repository/retrieve.repository.js";
import DatabaseConnection, { DeleteOptionsInterface } from "@src/database/connection.js";

export class DeleteUserUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(id: string, options?: DeleteOptionsInterface) {
    try {
      const readUserRepository = new RetrieveUserRepository(this.db);
      await readUserRepository.handle(id);
      const response = await new DeleteUserRepository(this.db).handle(id, options);

      return {
        acknowledged: response.acknowledged,
        deletedCount: response.deletedCount,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
