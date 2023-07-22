import { ObjectId } from "mongodb";
import { CategoryEntityInterface } from "../category.entity.js";
import DatabaseConnection, { RetrieveOptionsInterface } from "@src/database/connection.js";
import DatabaseManager from "@src/database/database-manager.js";

interface ResponseCategoryInterface extends CategoryEntityInterface {
  _id?: string | ObjectId;
}

export class RetrieveCategoryRepository {
  public databaseManager;

  constructor(databaseConnection: DatabaseConnection) {
    this.databaseManager = new DatabaseManager(databaseConnection, "categories");
  }

  public async handle(id: string, options?: RetrieveOptionsInterface): Promise<ResponseCategoryInterface> {
    const response: CategoryEntityInterface = await this.databaseManager.retrieve(id, options);

    return {
      _id: response._id?.toString(),
      ...response,
    };
  }
}
