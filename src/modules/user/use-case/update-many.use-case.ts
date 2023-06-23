import { objClean } from "@point-hub/express-utils";
import { UpdateManyUserRepository } from "../model/repository/update-many.repository.js";
import { UserEntity } from "../model/user.entity.js";
import { validate } from "../validation/update-many.validation.js";
import DatabaseConnection, { UpdateOptionsInterface, DocumentInterface } from "@src/database/connection.js";

interface UpdateManyResponseInterface {
  // Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined
  acknowledged: boolean;
  // The number of documents that matched the filter
  matchedCount: number;
  // The number of documents that were modified
  modifiedCount: number;
}

export class UpdateManyUserUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(
    document: DocumentInterface,
    options: UpdateOptionsInterface
  ): Promise<UpdateManyResponseInterface> {
    try {
      // validate request body
      validate(document);

      const user = new UserEntity({
        updatedAt: new Date(),
      });

      const updateResponse = await new UpdateManyUserRepository(this.db).handle(
        {
          name: {
            $regex: `${document.filter.name}`,
            $options: "i",
          },
        },
        {
          $set: objClean(user),
        },
        options
      );

      return {
        acknowledged: updateResponse.acknowledged,
        matchedCount: updateResponse.matchedCount,
        modifiedCount: updateResponse.modifiedCount,
      };
    } catch (error) {
      throw error;
    }
  }
}
