import { BaseCommand } from "@point-hub/express-cli";
import databaseConfig from "@src/config/database.js";
import DatabaseConnection from "@src/database/connection.js";
import MongoDbConnection from "@src/database/mongodb/connection-mongodb.js";

export default class DbSeedCommand extends BaseCommand {
  constructor() {
    super({
      name: "db:seed",
      description: "Seed database",
      summary: "Seed database",
      arguments: [],
      options: [],
    });
  }
  async handle(): Promise<void> {
    const dbConnection = new DatabaseConnection(
      new MongoDbConnection({
        name: databaseConfig[databaseConfig.default].name,
        url: databaseConfig[databaseConfig.default].url,
      })
    );
    dbConnection.database(databaseConfig[databaseConfig.default].name);
    try {
      await dbConnection.open();
      // seed Users colllection
      const { userSeeds } = await import("@src/modules/user/model/user.seed.js");
      await dbConnection.collection("users").deleteAll();
      const UserData = await dbConnection.collection("users").createMany(userSeeds);
      console.info(`[seed] seeding Users data`, UserData);
    } catch (error) {
      console.error(error);
    } finally {
      dbConnection.close();
    }
  }
}
