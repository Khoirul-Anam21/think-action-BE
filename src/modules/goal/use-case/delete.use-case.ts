import { DeleteResolutionRepository } from "../model/repository/delete.repository.js";
import DatabaseConnection, { DeleteOptionsInterface } from "@src/database/connection.js";
import { validateId } from "@src/utils/id-validator.js";

export class DeleteResolutionUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(id: string, options?: DeleteOptionsInterface) {
    try {
      validateId({ id });

      const deleteResolutionRepository = new DeleteResolutionRepository(this.db);
      await deleteResolutionRepository.handle(id, options);
      // const readUserRepository = new RetrieveUserRepository(this.db);
      // await readUserRepository.handle(id);
      // const response = await new DeleteUserRepository(this.db).handle(id, options);
      // return {
      //   acknowledged: response.acknowledged,
      //   deletedCount: response.deletedCount,
      // };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
