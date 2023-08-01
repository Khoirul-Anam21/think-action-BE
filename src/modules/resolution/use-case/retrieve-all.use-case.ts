import { ObjectId } from "mongodb";
import { RetrieveAllResolutionRepository } from "../model/repository/retrieve-all.repository.js";
import DatabaseConnection, { QueryInterface, RetrieveAllOptionsInterface } from "@src/database/connection.js";
import { RetrieveAllCheerRepository } from "@src/modules/cheer/model/repository/retrieve-all.repository.js";

export class RetrieveAllResolutionUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(user_id?: string, options?: RetrieveAllOptionsInterface, page = 1, limit = 10) {
    try {
      const retrieveAllResolutionRepository = new RetrieveAllResolutionRepository(this.db);
      const retrieveAllCheerRepository = new RetrieveAllCheerRepository(this.db);
      // const filterUser = user_id !== undefined;
      const result = await retrieveAllResolutionRepository.handle(
        {
          fields: "",
          filter: { user_id: new ObjectId(user_id) },
          page,
          pageSize: limit,
          sort: "user_id",
        },
        options
      );
      console.log(result);
      const updatedResolution = await Promise.all(
        result.data.map(async (resolution) => {
          const cheers = await retrieveAllCheerRepository.handle(
            {
              fields: "",
              filter: {
                post_id: new ObjectId(resolution._id),
                postType: resolution.postType,
              },
              page: 1,
              pageSize: 999,
              sort: "user_id",
            },
            options
          );
          return { ...resolution, cheers: cheers.data.length };
        })
      );
      return {
        data: updatedResolution,
        pagination: result.pagination,
      };
    } catch (error) {
      throw error;
    }
  }
}
