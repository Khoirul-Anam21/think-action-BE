import { objClean } from "@point-hub/express-utils";
import uploader, { deleteFileAfterUpload } from "../../../services/cloudinary/index.js";
import { RetrieveResolutionRepository } from "../model/repository/retrieve.repository.js";
import { UpdateResolutionRepository } from "../model/repository/update.repository.js";
import { ResolutionEntity } from "../model/resolution.entity.js";
import DatabaseConnection, { UpdateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { validateId } from "@src/utils/id-validator.js";

export class UpdateResolutionUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(id: string, document: DocumentInterface, images?: any, options?: UpdateOptionsInterface) {
    try {
      validateId({ id });
      // find user for id validation
      const readResolutionRepository = new RetrieveResolutionRepository(this.db);
      await readResolutionRepository.handle(id);
      if (images) {
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
        const newResolution = new ResolutionEntity({
          ...document,
          images: imageUrls,
          updatedAt: new Date(),
        });
        console.log(newResolution);
        const updateResolutionRepository = new UpdateResolutionRepository(this.db);
        await updateResolutionRepository.handle(id, objClean(newResolution), options);
        return;
      }

      // update database
      const newResolution = new ResolutionEntity({
        ...document,
        updatedAt: new Date(),
      });
      console.log(newResolution);
      const updateResolutionRepository = new UpdateResolutionRepository(this.db);
      await updateResolutionRepository.handle(id, objClean(newResolution), options);
      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
