import { ApiError } from "@point-hub/express-error-handler";
import { ObjectId } from "mongodb";
import { AggregateUserRepository } from "../model/repository/aggregate.repository.js";
import { RetrieveUserRepository } from "../model/repository/retrieve.repository.js";
import DatabaseConnection, {
  AggregateResultInterface,
  RetrieveOptionsInterface,
} from "@src/database/connection.js";
import { validateId } from "@src/utils/id-validator.js";

interface ResponseInterface {
  _id: string;
  photo?: string;
  accountName?: string;
  post?: string;
  biography?: string;
  createdAt?: Date;
}

export class RetrieveUserUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(
    id: string,
    options?: RetrieveOptionsInterface
  ): Promise<AggregateResultInterface> {
    try {
      validateId({ id });
      const response = await new RetrieveUserRepository(this.db).handle(
        id,
        options
      );
      if (!response) throw new ApiError(404, { msg: "user not found" });

      const userPipeline = [
        {
          $match: {
            _id: new ObjectId(id),
            accountType: "public",
          },
        },
        {
          $lookup: {
            from: "resolutions",
            localField: "_id",
            foreignField: "user_id",
            as: "resolutions",
          },
        },
        {
          $lookup: {
            from: "goals",
            localField: "_id",
            foreignField: "user_id",
            as: "goals",
          },
        },
        {
          $lookup: {
            from: "completions",
            localField: "_id",
            foreignField: "user_id",
            as: "completions",
          },
        },
        {
          $project: {
            _id: 1,
            accountName: 1,
            photo: 1,
            accountType: 1,
            biography: 1,
            posts: {
              $concatArrays: ["$resolutions", "$goals", "$completions"],
            },
          },
        },
      ];
      const aggregateUserRepository = new AggregateUserRepository(this.db);
      const result = await aggregateUserRepository.aggregate(userPipeline, {
        page: 1,
        pageSize: 999,
      });
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
