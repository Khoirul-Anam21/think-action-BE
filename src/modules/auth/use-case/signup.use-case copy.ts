import { objClean } from "@point-hub/express-utils";
import { validate } from "../validation/create.validation.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";

export class SignupUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(document: DocumentInterface, options: CreateOptionsInterface) {
    try {
      // // validate request body
      // validate(document);
      // // save to database
      // const UserEntity = objClean(
      //   new UserEntity({
      //     name: document.name,
      //     firstName: document.firstName,
      //     lastName: document.lastName,
      //     optionalUniqueColumn: document.optionalUniqueColumn,
      //     status: UserStatusTypes.Active,
      //     createdAt: new Date(),
      //   })
      // );
      // const response = await new CreateUserRepository(this.db).handle(UserEntity, options);
      // return {
      //   acknowledged: response.acknowledged,
      //   _id: response._id,
      // };
    } catch (error) {
      throw error;
    }
  }
}
