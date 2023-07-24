import { ObjectId } from "mongodb";
import { CreateSupportingRepository } from "../model/repository/create.repository.js";
import { SupportingEntity } from "../model/support.entity.js";
import { validate } from "../validation/create.validation.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";
import { UserDisplayInterface } from "@src/modules/user/model/user.entity.js";

export class CreateSupportingUseCase {
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
      const userSupporting: UserDisplayInterface = await retrieveUserRepository.handle(document.supporting_id);
      // console.log(document.resolution);
      // save to database
      const supportingEntity = new SupportingEntity({
        user_id: document.user_id,
        supporting: userSupporting,
        createdAt: new Date(),
      });

      const response = await new CreateSupportingRepository(this.db).handle(supportingEntity, options);
      console.log(supportingEntity);

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