import { ObjectId } from "mongodb";
import { RetrieveAllCheerRepository } from "../model/repository/retrieve-all.repository.js";
import { validateReadManyCheers } from "../validation/raeadMany.validation.js";
import DatabaseConnection, { RetrieveAllOptionsInterface } from "@src/database/connection.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";

export class RetrieveAllCheersUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(post_id: any, postType: any, options?: RetrieveAllOptionsInterface, page = 1, limit = 10) {
    try {
      // console.log(typeof user_id);
      validateReadManyCheers({ post_id, postType });
      const retrieveAllCheerRepository = new RetrieveAllCheerRepository(this.db);
      const result = await retrieveAllCheerRepository.handle(
        {
          fields: "",
          filter: { post_id: new ObjectId(post_id), postType },
          page: 1,
          pageSize: 999,
          sort: "user_id",
        },
        options
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}
