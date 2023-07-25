/**
 * MongoDB Schema
 *
 * https://www.mongodb.com/docs/v6.0/core/schema-validation/update-schema-validation/
 * https://www.mongodb.com/docs/drivers/node/current/fundamentals/indexes/
 * https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/
 */
import { IDatabaseAdapter } from "@src/database/connection.js";
import { MongoDBHelper } from "@src/database/mongodb/mongodb-helper.js";

export const collection = "goals";

export async function createCollection(db: IDatabaseAdapter) {
  try {
    const helper = new MongoDBHelper(db);

    if (!(await helper.isExists(collection))) {
      console.info(`[schema] ${collection} - create collection`);
      await db.createCollection(collection);
    }

    console.info(`[schema] ${collection} - update schema`);
    await db.updateSchema(collection, {
      bsonType: "object",
      required: ["name", "firstName", "lastName"],
      properties: {
        user: {
          user: "object",
          description: "User own the resolution",
        },
        resolution_id: {
          bsonType: "Object",
          description: "The reference to the resolution",
        },
        goal: {
          bsonType: "string",
          description: "The content of the resolution",
        },
        images: {
          bsonType: "array",
          description: "The resolution images",
        },
        category_id: {
          bsonType: "object",
          description: "The object id refer to category",
        },
        shareType: {
          bsonType: "string",
          description: "The visibility of resolution",
        },
        dueDate: {
          bsonType: "date",
          description: "Deadline of the resolution",
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

    if (await helper.isExists(collection)) {
      await db.dropCollection(collection);
      console.info(`[schema] drop ${collection} collection`);
    }
  } catch (error) {
    throw error;
  }
}
