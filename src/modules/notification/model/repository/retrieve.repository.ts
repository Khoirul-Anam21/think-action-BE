import { NotificationEntityInterface } from "../notification.entity.js";
import DatabaseConnection, { RetrieveOptionsInterface } from "@src/database/connection.js";
import DatabaseManager from "@src/database/database-manager.js";

interface ResponseNotificationInterface extends NotificationEntityInterface {
  _id: string;
}

export class RetrieveNotificationRepository {
  public databaseManager;

  constructor(databaseConnection: DatabaseConnection) {
    this.databaseManager = new DatabaseManager(databaseConnection, "notifications");
  }

  public async handle(id: string, options?: RetrieveOptionsInterface): Promise<ResponseNotificationInterface> {
    const response: NotificationEntityInterface = await this.databaseManager.retrieve(id, options);

    return {
      _id: response._id as string,
      ...response,
    };
  }
}
