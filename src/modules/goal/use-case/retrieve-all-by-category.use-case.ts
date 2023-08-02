import { ObjectId } from "mongodb";
import { RetrieveAllGoalRepository } from "../model/repository/retrieve-all.repository.js";
import DatabaseConnection, { QueryInterface, RetrieveAllOptionsInterface } from "@src/database/connection.js";
import { CategoryEntityInterface } from "@src/modules/category/model/category.entity.js";
import { RetrieveAllCheerRepository } from "@src/modules/cheer/model/repository/retrieve-all.repository.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";

export class RetrieveAllGoalByCategoryUseCase {
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
      // console.log(typeof user_id);
      const retrieveAllGoalRepository = new RetrieveAllGoalRepository(this.db);
      // const filterUser = user_id !== undefined;
      const retrieveAllCheerRepository = new RetrieveAllCheerRepository(this.db);
      const retrieveUserRepository = new RetrieveUserRepository(this.db);
      const result = await retrieveAllGoalRepository.handle(
        {
          fields: "",
          filter: {
            user_id: new ObjectId(user_id),
            category_id: new ObjectId(category_id),
          },
          page,
          pageSize: limit,
          sort: "",
        },
        options
      );
      const updatedGoal = await Promise.all(
        result.data.map(async (goal) => {
          const cheers = await retrieveAllCheerRepository.handle(
            {
              fields: "",
              filter: {
                post_id: new ObjectId(goal._id),
                postType: goal.postType,
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
          return { ...goal, category: categories[index], cheers: cheers.data.length };
        })
      );
      return {
        data: updatedGoal,
        pagination: result.pagination,
      };
    } catch (error) {
      throw error;
    }
  }
}
