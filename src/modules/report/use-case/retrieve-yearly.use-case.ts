import { ApiError } from "@point-hub/express-error-handler";
import { ObjectId } from "mongodb";
// import { validateReadManyNotifications } from "../validation/raeadMany.validation.js";
import DatabaseConnection, { RetrieveAllOptionsInterface } from "@src/database/connection.js";
import { CategoryEntityInterface } from "@src/modules/category/model/category.entity.js";
import { AggregateCompletionRepository } from "@src/modules/completion/model/repository/aggregate.repository.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";
import generateWeeksInYear from "@src/utils/week-date-generator.js";

export class RetrieveYearlyReportUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(user_id: string, year: number, options?: RetrieveAllOptionsInterface) {
    try {
      if (!year) throw new ApiError(400, { msg: "please input year properly" });
      const weeksInYear = generateWeeksInYear(year);
      const retrieveUserRepository = new RetrieveUserRepository(this.db);
      const aggregateCompletion = new AggregateCompletionRepository(this.db);
      const user = await retrieveUserRepository.handle(user_id, options);
      if (!user.categories) throw new ApiError(404, { msg: "Category not exist" });
      const report = await Promise.all(
        weeksInYear.map(async (weekData) => {
          const userCategories = user.categories as CategoryEntityInterface[];
          weekData.week = weekData.week - 1;
          const weekCompletion = await Promise.all(
            userCategories?.map(async (category) => {
              let completed = false;
              const postPipeline = [
                {
                  $match: {
                    $expr: {
                      $eq: [{ $week: "$createdAt" }, weekData.week],
                    },
                    user_id: new ObjectId(user._id),
                  },
                },
              ];
              const aggResult = await aggregateCompletion.aggregate(postPipeline, {
                page: 1,
                pageSize: 999,
              });
              // console.log(aggResult);
              const postData = aggResult.data.filter((completion) => completion.category_id === category._id)[0];
              if (postData) {
                completed = true;
              } else {
                completed = false;
              }
              return { category_id: category._id, completed };
            })
          );
          return { ...weekData, weekCompletion };
        })
      );
      return report;
    } catch (error) {
      throw error;
    }
  }
}
