import { CheerEntityInterface } from "../cheer.entity.js";
import DatabaseConnection, { RetrieveOptionsInterface } from "@src/database/connection.js";
import DatabaseManager from "@src/database/database-manager.js";

interface ResponseCheerInterface extends CheerEntityInterface {
  _id: string;
}

export class RetrieveCheerRepository {
  public databaseManager;

  constructor(databaseConnection: DatabaseConnection) {
    this.databaseManager = new DatabaseManager(databaseConnection, "cheers");
  }

  public async handle(id: string, options?: RetrieveOptionsInterface): Promise<ResponseCheerInterface> {
    const response: CheerEntityInterface = await this.databaseManager.retrieve(id, options);

    return {
      _id: response._id as string,
      ...response,
    };
  }
}
