import { ApiError } from "@point-hub/express-error-handler";
import { objClean } from "@point-hub/express-utils";
import { RetrieveUserRepository } from "../model/repository/retrieve.repository.js";
import { UpdateUserRepository } from "../model/repository/update.repository.js";
import { UserEntity } from "../model/user.entity.js";
import { validate } from "../validation/update.validation.js";
import DatabaseConnection, { UpdateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { validateId } from "@src/utils/id-validator.js";
import uploader, { deleteFileAfterUpload, getCloudinaryPublicId } from "@src/services/cloudinary/index.js";

export class UpdateUserUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(
    id: string,
    document?: DocumentInterface,
    photoFile?: Express.Multer.File,
    options?: UpdateOptionsInterface
  ) {
    try {
      // validate request body
      validate(document);

      // find user for id validation
      const readUserRepository = new RetrieveUserRepository(this.db);
      await readUserRepository.handle(id);
      if (photoFile) {
        // aplot foto
        const cldPublicId = getCloudinaryPublicId(document?.photo);
        await uploader.destroy(cldPublicId, { resource_type: "image" });

        const fileUpload = photoFile.path;
        const upload = await uploader.upload(fileUpload, {
          folder: "think-action/profile-photos", 
          resource_type: "image",
        });

        deleteFileAfterUpload(fileUpload);
        // update database
        const user = new UserEntity({
          ...document,
          photo: upload.secure_url,
          updatedAt: new Date(),
        });
        console.log(user);
        const userRepository = new UpdateUserRepository(this.db);
        await userRepository.handle(id, objClean(user), options);

        return;
      }
      // update database
      const user = new UserEntity({
        ...document,
        updatedAt: new Date(),
      });
      console.log(user);
      const userRepository = new UpdateUserRepository(this.db);
      await userRepository.handle(id, objClean(user), options);

      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
