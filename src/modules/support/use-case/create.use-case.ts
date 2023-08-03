import { ApiError } from "@point-hub/express-error-handler";
import { CreateSupportingRepository } from "../model/repository/create.repository.js";
import { SupportingEntity } from "../model/support.entity.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { CreateNotificationUseCase } from "@src/modules/notification/use-case/create.use-case.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";
import { UserEntityInterface } from "@src/modules/user/model/user.entity.js";

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
      const userSupporting: UserEntityInterface = await retrieveUserRepository.handle(document.supporting_id, {
        projection: {
          _id: 1,
          accountName: 1,
          accountType: 1,
          photo: 1,
        },
      });
      if (!userSupporting) throw new ApiError(404, { msg: "user not found" });
      if (userSupporting._id === document.user_id) throw new ApiError(400, { msg: "You can't support yourself" });
      if (userSupporting.accountType === "private") {
        const createNotificationUseCase = new CreateNotificationUseCase(this.db);
        const notification = await createNotificationUseCase.handle(
          {
            user_id: document.user_id,
            userNotified: userSupporting._id,
            messageType: "support",
          },
          options
        );
        return {
          notification_id: notification.id,
          msg: "The specified account is private, will notify instead",
          acknowledged: notification.acknowledged,
        };
      }
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
