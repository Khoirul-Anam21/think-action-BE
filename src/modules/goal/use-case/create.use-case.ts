import { objClean } from "@point-hub/express-utils";
import { ObjectId } from "mongodb";
import uploader, { deleteFileAfterUpload } from "../../../services/cloudinary/index.js";
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

  public async handle(document: DocumentInterface, images: any, options: CreateOptionsInterface) {
    try {
      // validate request body
      validateCreateGoal({ ...document, images });
      // find user
      const retrieveUserRepository = new RetrieveUserRepository(this.db);
      await retrieveUserRepository.handle(document.user_id);
      // save to database
      const imageUrls = await Promise.all(
        images?.map(async (image: Express.Multer.File) => {
          const path = image.path;
          const uploadRes = await uploader.upload(path, {
            folder: "think-action/posts",
            resource_type: "image",
            quality: 70,
          });
          await deleteFileAfterUpload(path);
          return uploadRes.secure_url;
        })
      );
      const goalEntity = new GoalEntity({
        user_id: document.user_id,
        goal: document.goal,
        images: imageUrls,
        category_id: document.category_id, // untuk sementara
        shareType: document.shareType,
        postType: "goal",
        dueDate: new Date(document.dueDate),
        createdAt: new Date(),
      });

      const response = await new CreateGoalRepository(this.db).handle(goalEntity, options);

      return {
        acknowledged: response.acknowledged,
        _id: response._id,
      };
    } catch (error) {
      throw error;
    }
  }
}
