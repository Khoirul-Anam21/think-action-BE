/**
 * MongoDB Schema
 *
 * https://www.mongodb.com/docs/v6.0/core/schema-validation/update-schema-validation/
 * https://www.mongodb.com/docs/drivers/node/current/fundamentals/indexes/
 * https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/
 */
import { IDatabaseAdapter } from "@src/database/connection.js";
import { MongoDBHelper } from "@src/database/mongodb/mongodb-helper.js";

export const supportingCollection = "supportings";

export async function createCollection(db: IDatabaseAdapter) {
  try {
    const helper = new MongoDBHelper(db);

    if (!(await helper.isExists(supportingCollection))) {
      console.info(`[schema] ${supportingCollection} - create collection`);
      await db.createCollection(supportingCollection);
    }

    console.info(`[schema] ${supportingCollection} - update schema`);
    await db.updateSchema(supportingCollection, {
      bsonType: "object",
      required: ["user_id", "supporter"],
      properties: {
        user_id: {
          user: "object",
          description: "current user",
        },
        supporter: {
          user: "object",
          description: "supporter of the user",
        },
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function dropCollection(db: IDatabaseAdapter) {
  try {
    const helper = new MongoDBHelper(db);

    if (await helper.isExists(supportingCollection)) {
      await db.dropCollection(supportingCollection);
      console.info(`[schema] drop ${supportingCollection} collection`);
    }
  } catch (error) {
    throw error;
  }
}
