import { validateId } from "@src/utils/id-validator.js";
import { RetrieveUserRepository } from "../model/repository/retrieve.repository.js";
import DatabaseConnection, { RetrieveOptionsInterface } from "@src/database/connection.js";

interface ResponseInterface {
  _id: string;
  username?: string;
  email?: string;
  photo?: string;
  accountName?: string;
  createdAt?: Date;
}

export class RetrieveUserUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(id: string, options?: RetrieveOptionsInterface): Promise<ResponseInterface> {
    try {
      validateId({ id });
      const response = await new RetrieveUserRepository(this.db).handle(id, options);

      return {
        _id: response._id,
        accountName: response.accountName,
        username: response.username,
        photo: response.photo,
        email: response.email,
        createdAt: response.createdAt,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
