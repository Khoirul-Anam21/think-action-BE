import { faker } from "@faker-js/faker";
import Factory from "@point-hub/express-factory";
import { ObjectId } from "mongodb";
import { CreateManyCommentRepository } from "./repository/create-many.repository.js";
import { CreateCommentRepository } from "./repository/create.repository.js";
import { db } from "@src/database/database.js";
import { CommentInterface } from "@src/modules/comment/model/comment.entity.js";

export class CommentFactory extends Factory<CommentInterface> {
  async createMany(count: number) {
    const CommentRepository = new CreateManyCommentRepository(db);
    return await CommentRepository.handle(this.makeMany(count));
  }
  definition() {
    return {
      user_id: new ObjectId().toString(),
      post_id: new ObjectId().toString(),
      postType: "resolution",
      comment: "",
    };
  }

  async create() {
    const CommentRepository = new CreateCommentRepository(db);
    return await CommentRepository.handle(this.makeOne());
  }
}
