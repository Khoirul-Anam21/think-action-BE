import DatabaseConnection, {
  DocumentInterface,
  CreateManyOptionsInterface,
  CreateManyResultInterface,
} from "@src/database/connection.js";
import DatabaseManager from "@src/database/database-manager.js";

export class CreateManySupportingRepository {
  public databaseManager: DatabaseManager;

  constructor(databaseConnection: DatabaseConnection) {
    this.databaseManager = new DatabaseManager(databaseConnection, "supportings");
  }

  public async handle(
    documents: Array<DocumentInterface>,
    options?: CreateManyOptionsInterface
  ): Promise<CreateManyResultInterface> {
    return await this.databaseManager.createMany(documents, options);
  }
}
