import { objClean } from "@point-hub/express-utils";
import { ObjectId } from "mongodb";
import { GoalEntity } from "../model/goal.entity.js";
import { CreateGoalRepository } from "../model/repository/create.repository.js";
import { validateCreateGoal } from "../validation/create.validation.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";

export class CreateGoalUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(document: DocumentInterface, options: CreateOptionsInterface) {
    try {
      // validate request body
      validateCreateGoal(document);
      // find user
      const retrieveUserRepository = new RetrieveUserRepository(this.db);
      const userFind = await retrieveUserRepository.handle(document.user_id);
      console.log(document.goal);
      // save to database
      const goalEntity = new GoalEntity({
        user: {
          _id: userFind._id,
          accountName: userFind.accountName,
          photo: userFind.photo,
        },
        resolution_id: new ObjectId(document.resolution_id),
        goal: document.goal,
        images: document.images,
        category_id: new ObjectId(document.category_id), // untuk sementara
        shareType: document.shareType,
        dueDate: new Date(document.dueDate),
        createdAt: new Date(),
      });

      const response = await new CreateGoalRepository(this.db).handle(goalEntity, options);
      console.log(goalEntity);

      return {
        acknowledged: response.acknowledged,
        _id: response._id,
      };
    } catch (error) {
      throw error;
    }
  }
}
