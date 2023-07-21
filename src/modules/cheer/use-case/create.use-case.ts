import { ObjectId } from "mongodb";
import { CheerEntity } from "../model/cheer.entity.js";
import { CreateCheerRepository } from "../model/repository/create.repository.js";
import { validate } from "../validation/create.validation.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";
import { UserDisplayInterface } from "@src/modules/user/model/user.entity.js";

export class CreateCheerUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(document: DocumentInterface, options: CreateOptionsInterface) {
    try {
      // validate request body
      // validate(document);
      // find user
      const retrieveUserRepository = new RetrieveUserRepository(this.db);
      const userCheer: UserDisplayInterface = await retrieveUserRepository.handle(document.Cheer_id);
      // console.log(document.resolution);
      // save to database
      const cheer = new CheerEntity({
        user_id: document.user_id,
        Cheer: userCheer,
        createdAt: new Date(),
      });

      const response = await new CreateCheerRepository(this.db).handle(CheerEntity, options);
      console.log(CheerEntity);

      return {
        acknowledged: response.acknowledged,
        _id: response._id,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
