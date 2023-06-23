import { objClean } from "@point-hub/express-utils";
// import { validate } from "../validation/create.validation.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { db } from "@src/database/database.js";
import { CreateUserRepository } from "@src/modules/user/model/repository/create.repository.js";
import { RetrieveAllUserRepository } from "@src/modules/user/model/repository/retrieve-all.repository.js";
import { UpdateUserRepository } from "@src/modules/user/model/repository/update.repository.js";
import { UserEntity } from "@src/modules/user/model/user.entity.js";
import { generateRefreshToken, signNewToken } from "@src/utils/jwt.js";

export class AuthUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(document: DocumentInterface, options?: CreateOptionsInterface) {
    try {
      console.log(document);
      const readManyUserRepository = new RetrieveAllUserRepository(this.db);
      const createUserRepository = new CreateUserRepository(this.db);
      const updateUserRepository = new UpdateUserRepository(this.db);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const findResult: any = await readManyUserRepository.handle({
        fields: "",
        filter: { email: document.email },
        page: 1,
        pageSize: 999,
        sort: "1",
      });
      console.log(findResult);
      if (findResult.data.length === 0) {
        const user = objClean(
          new UserEntity({
            username: document.name,
            email: document.email,
            displayName: document.name,
            photo: document.picture,
            createdAt: new Date(),
          })
        );
        console.table(user);
        const session = db.startSession();
        db.startTransaction();
        const newUser = await createUserRepository.handle(objClean(user), { session });
        const accessToken = signNewToken(
          process.env.JWT_ISSUER as string,
          process.env.JWT_SECRET as string,
          newUser._id
        );
        const refreshToken = generateRefreshToken(
          process.env.JWT_ISSUER as string,
          process.env.JWT_SECRET as string,
          newUser._id
        );
        await updateUserRepository.handle(newUser._id, { accessToken, refreshToken }, { session });
        await db.commitTransaction();
        return {
          _id: newUser._id,
          accessToken,
          refreshToken,
        };
      }
      const accessToken = signNewToken(
        process.env.JWT_ISSUER as string,
        process.env.JWT_SECRET as string,
        findResult.data[0]._id
      );
      const refreshToken = generateRefreshToken(
        process.env.JWT_ISSUER as string,
        process.env.JWT_SECRET as string,
        findResult.data[0]._id
      );
      await updateUserRepository.handle(findResult.data[0]._id, { accessToken, refreshToken });
      return {
        _id: findResult.data[0]._id,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      await db.abortTransaction();
      throw error;
    } finally {
      await db.endSession();
    }
  }
}
