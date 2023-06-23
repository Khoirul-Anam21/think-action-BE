import { DeleteManyUserRepository } from "../model/repository/delete-many.repository.js";
import DatabaseConnection, { DeleteOptionsInterface } from "@src/database/connection.js";

export class DeleteManyUserUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(listId: string[], options: DeleteOptionsInterface) {
    try {
      const response = await new DeleteManyUserRepository(this.db).handle(
        {
          _id: {
            $in: listId,
          },
        },
        options
      );

      return {
        acknowledged: response.acknowledged,
        deletedCount: response.deletedCount,
      };
    } catch (error) {
      throw error;
    }
  }
}
