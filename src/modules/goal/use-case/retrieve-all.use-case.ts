import { ObjectId } from "mongodb";
import { RetrieveAllGoalRepository } from "../model/repository/retrieve-all.repository.js";
import DatabaseConnection, {
  QueryInterface,
  RetrieveAllOptionsInterface,
} from "@src/database/connection.js";

export class RetrieveAllGoalUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(
    user_id?: string,
    options?: RetrieveAllOptionsInterface,
    page = 1,
    limit = 10
  ) {
    try {
      console.log(typeof user_id);
      const retrieveAllGoalRepository = new RetrieveAllGoalRepository(this.db);
      const filterUser = user_id !== undefined;
      const result = await retrieveAllGoalRepository.handle(
        {
          fields: "",
          filter: filterUser ? { "user._id": new ObjectId(user_id) } : {},
          page,
          pageSize: limit,
          sort: "resolution",
        },
        options
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}
