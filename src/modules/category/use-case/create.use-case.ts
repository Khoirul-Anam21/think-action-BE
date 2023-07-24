import { ObjectId } from "mongodb";
import { CategoryEntity } from "../model/category.entity.js";
import { validateCategoryCreate } from "../validation/create.validation.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";
import { UpdateUserRepository } from "@src/modules/user/model/repository/update.repository.js";

export class CreateCategoryUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(document: DocumentInterface, options: CreateOptionsInterface) {
    try {
      validateCategoryCreate(document);

      const retrieveUserRepository = new RetrieveUserRepository(this.db);
      const updateUserRepository = new UpdateUserRepository(this.db);
      const user = await retrieveUserRepository.handle(document.user_id, options);
      // console.log(document.resolution);
      // save to database
      const category = new CategoryEntity({
        _id: new ObjectId().toString(), 
        category: document.category,
        createdAt: new Date(),
      });

      if (!user.categories) {
        const newCategory = [category];
        await updateUserRepository.handle(document.user_id, { categories: newCategory });
        return {
          _id: category._id,
        };
      }
   
      const userCategories = user.categories;
      userCategories?.push(category);

      await updateUserRepository.handle(document.user_id, { categories: userCategories });

      return {
        _id: category._id,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
