import { ObjectId } from "mongodb";
import { RetrieveAllResolutionRepository } from "../model/repository/retrieve-all.repository.js";
import DatabaseConnection, { QueryInterface, RetrieveAllOptionsInterface } from "@src/database/connection.js";
import { CategoryEntityInterface } from "@src/modules/category/model/category.entity.js";
import { RetrieveAllCheerRepository } from "@src/modules/cheer/model/repository/retrieve-all.repository.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";
// import { validateId } from "@src/utils/id-validator.js";

export class RetrieveResolutionByCategoryUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(
    category_id?: string,
    user_id?: string,
    options?: RetrieveAllOptionsInterface,
    page = 1,
    limit = 10
  ) {
    try {
      // validateId({ category_id });
      const retrieveAllResolutionRepository = new RetrieveAllResolutionRepository(this.db);
      const retrieveAllCheerRepository = new RetrieveAllCheerRepository(this.db);
      const retrieveUserRepository = new RetrieveUserRepository(this.db);
      // const filterUser = user_id !== undefined;
      const result = await retrieveAllResolutionRepository.handle(
        {
          fields: "",
          filter: {
            user_id: new ObjectId(user_id),
            category_id: new ObjectId(category_id),
          },
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
          const categories = (await retrieveUserRepository.handle(user_id as string))
            .categories as CategoryEntityInterface[];
          const index = categories?.findIndex((category) => category._id === category_id);
          return {
            ...resolution,
            category: categories[index as number].category,
            cheers: cheers.data.length,
          };
        })
      );
      return {
        data: updatedResolution[0],
        pagination: result.pagination,
      };
    } catch (error) {
      throw error;
    }
  }
}
