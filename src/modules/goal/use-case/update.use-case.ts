import { ApiError } from "@point-hub/express-error-handler";
import { objClean } from "@point-hub/express-utils";
import { GoalEntity } from "../model/goal.entity.js";
import { RetrieveGoalRepository } from "../model/repository/retrieve.repository.js";
import { UpdateGoalRepository } from "../model/repository/update.repository.js";
// import { validate } from "../validation/update.validation.js";
import DatabaseConnection, { UpdateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { validateId } from "@src/utils/id-validator.js";

export class UpdateGoalUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(id: string, document: DocumentInterface, images: any, options?: UpdateOptionsInterface) {
    try {
      // validate request body
      // validate(document);
      validateId({ id });
      // find user for id validation
      const readGoalRepository = new RetrieveGoalRepository(this.db);
      await readGoalRepository.handle(id);
      // update database
      const newGoal = new GoalEntity({
        ...document,
        updatedAt: new Date(),
      });
      console.log(newGoal);
      const updateGoalRepository = new UpdateGoalRepository(this.db);
      await updateGoalRepository.handle(id, objClean(newGoal), options);
      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
