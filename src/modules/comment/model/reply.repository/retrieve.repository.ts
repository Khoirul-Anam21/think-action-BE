import { ReplyEntityInterface } from "../comment.entity.js";
import DatabaseConnection, { RetrieveOptionsInterface } from "@src/database/connection.js";
import DatabaseManager from "@src/database/database-manager.js";

interface ResponseReplyInterface extends ReplyEntityInterface {
  _id: string;
}

export class RetrieveReplyRepository {
  public databaseManager;

  constructor(databaseConnection: DatabaseConnection) {
    this.databaseManager = new DatabaseManager(databaseConnection, "replies");
  }

  public async handle(id: string, options?: RetrieveOptionsInterface): Promise<ResponseReplyInterface> {
    const response: ReplyEntityInterface = await this.databaseManager.retrieve(id, options);

    return {
      _id: response._id as string,
      ...response,
    };
  }
}
