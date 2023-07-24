import { ObjectId } from "mongodb";
import { RetrieveAllCategoryRepository } from "../model/repository/retrieve-all.repository.js";
import DatabaseConnection, { RetrieveAllOptionsInterface } from "@src/database/connection.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";

export class RetrieveAllCategoryUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(user_id: string, options?: RetrieveAllOptionsInterface) {
    try {
      console.log(typeof user_id);
      const retrieveUserRepository = new RetrieveUserRepository(this.db);
      const user = await retrieveUserRepository.handle(user_id?.toString());
      return user.categories;
    } catch (error) {
      throw error;
    }
  }
}
