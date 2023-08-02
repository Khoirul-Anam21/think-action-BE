import uploader, { deleteFileAfterUpload } from "../../../services/cloudinary/index.js";
import { CompletionEntity } from "../model/completion.entity.js";
import { CreateCompletionRepository } from "../model/repository/create.repository.js";
// import { validateCreateCompletion } from "../validation/create.validation.js";
import { validateCreateCompletion } from "../validation/create.validation.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";

export class CreateCompletionUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(document: DocumentInterface, images: any, options: CreateOptionsInterface) {
    try {
      // validate request body
      validateCreateCompletion({ ...document, images });
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
      const completion = new CompletionEntity({
        user_id: document.user_id,
        caption: document.caption,
        images: imageUrls,
        category_id: document.category_id, // untuk sementara
        goal_id: document.goal_id,
        completedResolution: document.completedResolution,
        shareType: document.shareType,
        postType: "completion",
        dueDate: new Date(document.dueDate),
        createdAt: new Date(),
      });

      console.log(document.user_id);

      const response = await new CreateCompletionRepository(this.db).handle(completion, options);

      return {
        acknowledged: response.acknowledged,
        _id: response._id,
      };
    } catch (error) {
      throw error;
    }
  }
}
