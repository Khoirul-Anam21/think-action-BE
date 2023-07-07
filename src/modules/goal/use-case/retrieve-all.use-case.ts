import { ObjectId } from "mongodb";
import { RetrieveAllResolutionRepository } from "../model/repository/retrieve-all.repository.js";
import DatabaseConnection, { QueryInterface, RetrieveAllOptionsInterface } from "@src/database/connection.js";

export class RetrieveAllResolutionUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(user_id?: string, options?: RetrieveAllOptionsInterface, page = 1, limit = 10) {
    try {
      console.log(typeof user_id);
      const retrieveAllResolutionRepository = new RetrieveAllResolutionRepository(this.db);
      const filterUser = user_id !== undefined;
      const result = await retrieveAllResolutionRepository.handle(
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
      // const response = await new RetrieveAllUserRepository(this.db).handle(query, options);
      // return {
      //   users: response.data,
      //   pagination: response.pagination,
      // };
    } catch (error) {
      throw error;
    }
  }
}
