/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from "@point-hub/express-error-handler";
import { ObjectId } from "mongodb";
import { AggregateUserRepository } from "../model/repository/aggregate.repository.js";
import { RetrieveUserRepository } from "../model/repository/retrieve.repository.js";
import DatabaseConnection, { RetrieveOptionsInterface } from "@src/database/connection.js";
import { CategoryEntityInterface } from "@src/modules/category/model/category.entity.js";
import { RetrieveAllSupporterUseCase } from "@src/modules/support/use-case/retrieve-supporter.use-case.js";
import { RetrieveAllSupportingUseCase } from "@src/modules/support/use-case/retrieve-supporting.use-case.js";
import { validateId } from "@src/utils/id-validator.js";

interface ResponseInterface {
  _id?: string;
  photo?: string;
  accountName?: string;
  biography?: string;
  posts?: any[];
  supporters?: number;
  supportings?: number;
  createdAt?: Date;
}

export class RetrieveUserUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(
    id: string,
    currentUser_id?: string,
    options?: RetrieveOptionsInterface
  ): Promise<ResponseInterface> {
    try {
      validateId({ id });
      const response = await new RetrieveUserRepository(this.db).handle(id, {
        projection: {
          _id: 1,
          photo: 1,
          accountName: 1,
          accountType: 1,
          biography: 1,
        },
      });
      // console.log(response);
      // supports
      const retrieveAllSupporterUseCase = new RetrieveAllSupporterUseCase(this.db);
      const retrieveAllSupportingUseCase = new RetrieveAllSupportingUseCase(this.db);
      if (!response) throw new ApiError(404, { msg: "user not found" });

      if (id === currentUser_id) {
        const result = getUserDetail(id, response.accountType as string, this.db, options, true);
        return result;
      }

      const supportingLists = await retrieveAllSupportingUseCase.handle(currentUser_id);
      // is supporting a private accuout
      const isSupportingButPrivate =
        supportingLists.data.filter((supporting) => supporting?._id === id)[0] && response.accountType === "private";

      if (isSupportingButPrivate) {
        const result = getUserDetail(id, response.accountType as string, this.db, options);
        return result;
      }

      if (response.accountType === "personal" || response.accountType === "private") {
        const supporters = await retrieveAllSupporterUseCase.handle(id, options);
        const supportings = await retrieveAllSupportingUseCase.handle(id, options);
        return { ...response, posts: [], supporters: supporters.data.length, supportings: supportings.data.length };
      }

      const result = getUserDetail(id, response.accountType as string, this.db, options);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

const getUserDetail = async (
  user_id: string,
  accountType: string,
  db: DatabaseConnection,
  options?: RetrieveOptionsInterface,
  // indicates whether this user retrieving its own data
  owner?: boolean
) => {
  try {
    const response = await new RetrieveUserRepository(db).handle(user_id, options);
    // console.log(response);
    const userPipeline = owner
      ? [
          {
            $match: {
              _id: new ObjectId(user_id),
              accountType: accountType,
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
        ]
      : [
          {
            $match: {
              _id: new ObjectId(user_id),
              accountType: accountType,
            },
          },
          {
            $lookup: {
              from: "resolutions",
              localField: "_id",
              foreignField: "user_id",
              as: "resolutions",
              pipeline: [
                {
                  $match: {
                    shareType: "public",
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "goals",
              localField: "_id",
              foreignField: "user_id",
              as: "goals",
              pipeline: [
                {
                  $match: {
                    shareType: "public",
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "completions",
              localField: "_id",
              foreignField: "user_id",
              as: "completions",
              pipeline: [
                {
                  $match: {
                    shareType: "public",
                  },
                },
              ],
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
    const aggregateUserRepository = new AggregateUserRepository(db);
    const result = await aggregateUserRepository.aggregate(userPipeline, {
      page: 1,
      pageSize: 999,
    });
    console.log(result);

    // supports
    const retrieveAllSupporterUseCase = new RetrieveAllSupporterUseCase(db);
    const retrieveAllSupportingUseCase = new RetrieveAllSupportingUseCase(db);

    const supporters = await retrieveAllSupporterUseCase.handle(user_id, options);
    const supportings = await retrieveAllSupportingUseCase.handle(user_id, options);

    if ((result.data[0].posts as any).length > 0) {
      const posts: any = result.data[0].posts;
      const postsWithCategory = posts.map((post: any) => {
        const categories = response.categories as CategoryEntityInterface[];
        const index = categories?.findIndex((category) => category._id === post.category_id);
        return { ...post, categoryName: categories[index].category };
      });

      result.data[0].posts = postsWithCategory;
    }

    return { ...result.data[0], supporters: supporters.data.length, supportings: supportings.data.length };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
