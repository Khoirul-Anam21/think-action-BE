import { CommentEntityInterface } from "../comment.entity.js";
import DatabaseConnection, { RetrieveOptionsInterface } from "@src/database/connection.js";
import DatabaseManager from "@src/database/database-manager.js";

interface ResponseCommentInterface extends CommentEntityInterface {
  _id: string;
}

export class RetrieveCommentRepository {
  public databaseManager;

  constructor(databaseConnection: DatabaseConnection) {
    this.databaseManager = new DatabaseManager(databaseConnection, "comments");
  }

  public async handle(id: string, options?: RetrieveOptionsInterface): Promise<ResponseCommentInterface> {
    const response: CommentEntityInterface = await this.databaseManager.retrieve(id, options);

    return {
      _id: response._id as string,
      ...response,
    };
  }
}
