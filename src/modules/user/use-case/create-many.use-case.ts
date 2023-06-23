import { objClean } from "@point-hub/express-utils";
import { CreateManyUserRepository } from "../model/repository/create-many.repository.js";
import { UserEntity } from "../model/user.entity.js";
import { validate } from "../validation/create-many.validation.js";
import DatabaseConnection, { CreateManyOptionsInterface, DocumentInterface } from "@src/database/connection.js";

export class CreateManyUserUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(documents: Array<DocumentInterface>, options: CreateManyOptionsInterface) {
    try {
      // validate request body
      validate(documents);

      // define entity
      const entities = [];
      for (const document of documents) {
        entities.push(
          objClean(
            new UserEntity({
              username: document.name,
              email: document.firstName,
              displayName: document.lastName,
              createdAt: new Date(),
            })
          )
        );
      }

      // save to database
      const response = await new CreateManyUserRepository(this.db).handle(entities, options);

      return {
        acknowledged: response.acknowledged,
        insertedCount: response.insertedCount,
        insertedIds: response.insertedIds,
      };
    } catch (error) {
      throw error;
    }
  }
}
