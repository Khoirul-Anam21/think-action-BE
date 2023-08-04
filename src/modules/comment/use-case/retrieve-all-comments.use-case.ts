import { ApiError } from "@point-hub/express-error-handler";
import { ObjectId } from "mongodb";
import { AggregateCommentRepository } from "../model/repository/aggregate.repository.js";
import { validateReadComments } from "../validation/readMany.validation.js";
import DatabaseConnection, { RetrieveAllOptionsInterface } from "@src/database/connection.js";
import { FindPost } from "@src/utils/post-finder.js";

export class RetrieveAllCommentsUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(post_id: any, postType: any, options?: RetrieveAllOptionsInterface, page = 1, limit = 10) {
    try {
      // console.log(typeof user_id);
      validateReadComments({ post_id, postType });
      const aggregateCommentRepository = new AggregateCommentRepository(this.db);
      const findPost = await FindPost(postType, post_id, this.db, options);

      if (!findPost) throw new ApiError(404, { msg: "post not found" });

      const commentPipeline = [
        {
          $match: {
            post_id: new ObjectId(post_id),
            postType: postType,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  accountName: 1,
                  photo: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: "replies",
            localField: "_id",
            foreignField: "comment_id",
            as: "replies",
          },
        },
        {
          $unwind: {
            path: "$replies",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "replies.user_id",
            foreignField: "_id",
            as: "replies.user",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  accountName: 1,
                  photo: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$replies.user",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $unset: ["user_id", "replies.user_id"],
        },
        {
          $group: {
            _id: "$_id",
            user: {
              $first: "$user",
            },
            post_id: {
              $first: "$post_id",
            },
            postType: {
              $first: "$postType",
            },
            comment: {
              $first: "$comment",
            },
            createdAt: {
              $first: "$createdAt",
            },
            replies: {
              $push: "$replies",
            },
          },
        },
      ];
      const result = await aggregateCommentRepository.aggregate(commentPipeline, { page: 1, pageSize: 999 });
      return result;
    } catch (error) {
      throw error;
    }
  }
}
