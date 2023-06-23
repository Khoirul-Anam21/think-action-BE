import DatabaseConnection, { QueryInterface, RetrieveAllOptionsInterface } from "@src/database/connection.js";

export class RetrieveAllUserUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(query: QueryInterface, options?: RetrieveAllOptionsInterface) {
    try {
      // const response = await new RetrieveAllUserRepository(this.db).handle(query, options);
      // return {
      //   users: response.data,
      //   pagination: response.pagination,
      // };
    } catch (error) {
      throw error;
    }
  }
}
