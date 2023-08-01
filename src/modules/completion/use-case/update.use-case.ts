import { objClean } from "@point-hub/express-utils";
import { CompletionEntity } from "../model/completion.entity.js";
import { RetrieveCompletionRepository } from "../model/repository/retrieve.repository.js";
import { UpdateCompletionRepository } from "../model/repository/update.repository.js";
// import { validate } from "../validation/update.validation.js";
import DatabaseConnection, { UpdateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import uploader, { deleteFileAfterUpload } from "@src/services/cloudinary/index.js";
import { validateId } from "@src/utils/id-validator.js";

export class UpdateCompletionUseCase {
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
      const readCompletionRepository = new RetrieveCompletionRepository(this.db);
      await readCompletionRepository.handle(id);

      if (images) {
        const imageUrls = await Promise.all(
          images?.map(async (image: Express.Multer.File) => {
            const path = image.path;
            const uploadRes = await uploader.upload(path, { folder: "think-action/posts", resource_type: "image" });
            await deleteFileAfterUpload(path);
            return uploadRes.secure_url;
          })
        );
        const newCompletion = new CompletionEntity({
          ...document,
          images: imageUrls,
          updatedAt: new Date(),
        });
        const updateCompletionRepository = new UpdateCompletionRepository(this.db);
        await updateCompletionRepository.handle(id, objClean(newCompletion), options);
        return;
      }

      // update database
      const newCompletion = new CompletionEntity({
        ...document,
        updatedAt: new Date(),
      });
      console.log(newCompletion);
      const updateCompletionRepository = new UpdateCompletionRepository(this.db);
      await updateCompletionRepository.handle(id, objClean(newCompletion), options);
      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
