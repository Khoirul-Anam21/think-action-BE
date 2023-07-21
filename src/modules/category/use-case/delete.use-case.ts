// import { DeleteResolutionRepository } from "../model/supporter/repository/delete.repository.js";
import { ApiError } from "@point-hub/express-error-handler";
import { DeleteCategoryRepository } from "../model/repository/delete.repository.js";
import DatabaseConnection, { DeleteOptionsInterface } from "@src/database/connection.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";
import { UpdateUserRepository } from "@src/modules/user/model/repository/update.repository.js";
import { validateId } from "@src/utils/id-validator.js";

export class DeleteCategoryUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(id: string, user_id: string, options?: DeleteOptionsInterface) {
    try {
      validateId({ id });
      const retrieveUserRepository = new RetrieveUserRepository(this.db);
      const updateUserRepository = new UpdateUserRepository(this.db);
      const user = await retrieveUserRepository.handle(user_id, options);

      const categories = user.categories;
      const categoryIndex = categories?.findIndex((category) => category._id === id) ?? 0;
      console.log(categories);
      console.log(id);
      if (categoryIndex === 0) throw new ApiError(404, { msg: "category not found" });
      categories?.splice(categoryIndex, 1);

      await updateUserRepository.handle(user_id, { categories }, options);
      return {};
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
