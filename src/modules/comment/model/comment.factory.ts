import { faker } from "@faker-js/faker";
import Factory from "@point-hub/express-factory";
import { ObjectId } from "mongodb";
import { CommentEntityInterface } from "./comment.entity.js";
import { CreateManyCommentRepository } from "./comment.repository/create-many.repository.js";
import { CreateCommentRepository } from "./comment.repository/create.repository.js";
import { db } from "@src/database/database.js";

export class CommentFactory extends Factory<CommentEntityInterface> {
  async createMany(count: number) {
    const CommentRepository = new CreateManyCommentRepository(db);
    return await CommentRepository.handle(this.makeMany(count));
  }
  definition() {
    return {
      userCommenter_id: new ObjectId(),
      post_id: new ObjectId(),
      postType: "resolution",
    };
  }

  async create() {
    const CommentRepository = new CreateCommentRepository(db);
    return await CommentRepository.handle(this.makeOne());
  }
}
