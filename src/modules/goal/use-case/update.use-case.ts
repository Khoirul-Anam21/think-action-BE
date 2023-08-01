import { objClean } from "@point-hub/express-utils";
import { GoalEntity } from "../model/goal.entity.js";
import { RetrieveGoalRepository } from "../model/repository/retrieve.repository.js";
import { UpdateGoalRepository } from "../model/repository/update.repository.js";
import DatabaseConnection, { UpdateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import uploader, { deleteFileAfterUpload } from "@src/services/cloudinary/index.js";
import { validateId } from "@src/utils/id-validator.js";

export class UpdateGoalUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(id: string, document: DocumentInterface, images: any, options?: UpdateOptionsInterface) {
    try {
      validateId({ id });
      // find user for id validation
      const readGoalRepository = new RetrieveGoalRepository(this.db);
      await readGoalRepository.handle(id);
      if (images) {
        const imageUrls = await Promise.all(
          images?.map(async (image: Express.Multer.File) => {
            const path = image.path;
            const uploadRes = await uploader.upload(path, { folder: "think-action/posts", resource_type: "image" });
            await deleteFileAfterUpload(path);
            return uploadRes.secure_url;
          })
        );
        const newGoal = new GoalEntity({
          ...document,
          images: imageUrls,
          updatedAt: new Date(),
        });
        const updateGoalRepository = new UpdateGoalRepository(this.db);
        await updateGoalRepository.handle(id, objClean(newGoal), options);
        return;
      }
      // update database
      const newGoal = new GoalEntity({
        ...document,
        updatedAt: new Date(),
      });
      const updateGoalRepository = new UpdateGoalRepository(this.db);
      await updateGoalRepository.handle(id, objClean(newGoal), options);
      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
