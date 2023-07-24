import { ObjectId } from "mongodb";
import { CheerEntity } from "../model/cheer.entity.js";
import { CreateCheerRepository } from "../model/repository/create.repository.js";
import { validate } from "../validation/create.validation.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";
import { UserDisplayInterface } from "@src/modules/user/model/user.entity.js";
import { FindPost } from "@src/utils/post-finder.js";
import { RetrieveAllCheerRepository } from "../model/repository/retrieve-all.repository.js";
import { ApiError } from "@point-hub/express-error-handler";

export class CreateCheerUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(document: DocumentInterface, options: CreateOptionsInterface) {
    try {

      const retrieveAllCheerRepository = new RetrieveAllCheerRepository(this.db);
      const cheers = await retrieveAllCheerRepository.handle({
        fields: "",
        filter: { userCheerer_id: new ObjectId(document.user_id), post_id: document.post_id, postType: document.postType },
        page: 1,
        pageSize: 9999,
        sort: "user_id",
      },);

      console.log(cheers);
      if (cheers.data.length === 0) throw new ApiError(400, { msg: "You already cheered this post" })

      await FindPost(document.postType, document.post_id, this.db, options);

      const cheer = new CheerEntity({
        post_id: document.post_id,
        postType: document.postType,
        userCheerer_id: document.user_id,
        createdAt: new Date(),
      })
      const response = await new CreateCheerRepository(this.db).handle(cheer, options);

      // TODO: Notif
      return {
        acknowledged: response.acknowledged,
        _id: response._id,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
