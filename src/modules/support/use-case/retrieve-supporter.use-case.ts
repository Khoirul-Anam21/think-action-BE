import { ObjectId } from "mongodb";
import { RetrieveAllSupportingRepository } from "../model/repository/retrieve-all.repository.js";
import DatabaseConnection, { RetrieveAllOptionsInterface } from "@src/database/connection.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";

export class RetrieveAllSupporterUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(user_id?: string, options?: RetrieveAllOptionsInterface, page = 1, limit = 10) {
    try {
      console.log(typeof user_id);
      const retrieveAllSupportingRepository = new RetrieveAllSupportingRepository(this.db);
      const retrieveUserRepository = new RetrieveUserRepository(this.db);
      // const userSupporter = await retrieveUserRepository.handle(user_id?.toString() ?? "", {
      //   projection: { _id: 1, accountName: 1, photo: 1 },
      // });
      const result = await retrieveAllSupportingRepository.handle(
        {
          fields: "",
          filter: { "supporting._id": new ObjectId(user_id) },
          page,
          pageSize: limit,
          sort: "",
        },
        options
      );
      const dataResult = result.data;
      const newResult = await Promise.all(
        dataResult.map(async (data) => {
          const user = await retrieveUserRepository.handle(data.user_id as string, {
            projection: { _id: 1, accountName: 1, photo: 1 },
          });
          return user;
        })
      );
      return {
        data: newResult,
        pagination: result.pagination,
      };
    } catch (error) {
      throw error;
    }
  }
}
