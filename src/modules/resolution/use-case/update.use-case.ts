import { ApiError } from "@point-hub/express-error-handler";
import { objClean } from "@point-hub/express-utils";
import { RetrieveResolutionRepository } from "../model/repository/retrieve.repository.js";
import { UpdateResolutionRepository } from "../model/repository/update.repository.js";
import { ResolutionEntity } from "../model/resolution.entity.js";
import { validate } from "../validation/update.validation.js";
import DatabaseConnection, { UpdateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { validateId } from "@src/utils/id-validator.js";

export class UpdateResolutionUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(id: string, document: DocumentInterface, options?: UpdateOptionsInterface) {
    try {
      // validate request body
      // validate(document);
      validateId({ id });
      // find user for id validation
      const readResolutionRepository = new RetrieveResolutionRepository(this.db);
      await readResolutionRepository.handle(id);
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
