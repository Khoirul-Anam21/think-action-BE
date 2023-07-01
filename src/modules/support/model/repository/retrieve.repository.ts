import { SupportingEntityInterface } from "../support.entity.js";
import DatabaseConnection, { RetrieveOptionsInterface } from "@src/database/connection.js";
import DatabaseManager from "@src/database/database-manager.js";

interface ResponseSupportingInterface extends SupportingEntityInterface {
  _id: string;
}

export class RetrieveSupportingRepository {
  public databaseManager;

  constructor(databaseConnection: DatabaseConnection) {
    this.databaseManager = new DatabaseManager(databaseConnection, "supportings");
  }

  public async handle(id: string, options?: RetrieveOptionsInterface): Promise<ResponseSupportingInterface> {
    const response: SupportingEntityInterface = await this.databaseManager.retrieve(id, options);

    return {
      _id: response._id as string,
      ...response,
    };
  }
}
