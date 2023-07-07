import { objClean } from "@point-hub/express-utils";
import { ObjectId } from "mongodb";
import { CreateResolutionRepository } from "../model/repository/create.repository.js";
import { ResolutionEntity } from "../model/goal.entity.js";
import { validate } from "../validation/create.validation.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";

export class CreateResolutionUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(document: DocumentInterface, options: CreateOptionsInterface) {
    try {
      // validate request body
      validate(document);
      // find user
      const retrieveUserRepository = new RetrieveUserRepository(this.db);
      const userFind = await retrieveUserRepository.handle(document.user_id);
      console.log(document.resolution);
      // save to database
      const resolutionEntity = new ResolutionEntity({
        user: {
          _id: userFind._id,
          accountName: userFind.accountName,
          photo: userFind.photo,
        },
        resolution: document.resolution,
        images: document.images,
        category_id: new ObjectId(document.category_id), // untuk sementara
        shareType: document.shareType,
        completed: false,
        dueDate: new Date(document.dueDate),
        createdAt: new Date(),
      });

      const response = await new CreateResolutionRepository(this.db).handle(resolutionEntity, options);
      console.log(resolutionEntity);

      return {
        acknowledged: response.acknowledged,
        _id: response._id,
      };
    } catch (error) {
      throw error;
    }
  }
}
