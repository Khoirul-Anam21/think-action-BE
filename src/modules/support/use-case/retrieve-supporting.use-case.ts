import { ObjectId } from "mongodb";
import { RetrieveAllSupportingRepository } from "../model/repository/retrieve-all.repository.js";
import DatabaseConnection, { RetrieveAllOptionsInterface } from "@src/database/connection.js";

export class RetrieveAllSupportingUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(user_id?: string, options?: RetrieveAllOptionsInterface, page = 1, limit = 10) {
    try {
      console.log(typeof user_id);
      const retrieveAllSupportingRepository = new RetrieveAllSupportingRepository(this.db);
      // const retrieveUserRepository = new RetrieveUserRepository(this.db);
      const result = await retrieveAllSupportingRepository.handle(
        {
          fields: "",
          filter: { user_id: new ObjectId(user_id) },
          page,
          pageSize: limit,
          sort: "user_id",
          excludeFields: ["supporting.accessToken", "supporting.refreshToken", "supporting.accountType"],
        },
        options
      );
      const supportingUsers = result.data.map((supporting) => supporting.supporting);
      return {
        data: supportingUsers,
        pagination: result.pagination,
      };
    } catch (error) {
      throw error;
    }
  }
}
