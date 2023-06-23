import { objClean } from "@point-hub/express-utils";
import { CreateUserRepository } from "../model/repository/create.repository.js";
import { UserEntity } from "../model/resolution.entity.js";
import { validate } from "../validation/create.validation.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";

export class CreateUserUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(document: DocumentInterface, options: CreateOptionsInterface) {
    try {
      // validate request body
      validate(document);

      // save to database
      const user = objClean(
        new UserEntity({
          username: document.name,
          email: document.firstName,
          displayName: document.lastName,
          createdAt: new Date(),
        })
      );

      const response = await new CreateUserRepository(this.db).handle(user, options);

      return {
        acknowledged: response.acknowledged,
        _id: response._id,
      };
    } catch (error) {
      throw error;
    }
  }
}
