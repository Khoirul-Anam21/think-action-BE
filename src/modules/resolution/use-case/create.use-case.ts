import { ApiError } from "@point-hub/express-error-handler";
import { ObjectId } from "mongodb";
import uploader, { deleteFileAfterUpload } from "../../../services/cloudinary/index.js";
import { CreateResolutionRepository } from "../model/repository/create.repository.js";
import { RetrieveAllResolutionRepository } from "../model/repository/retrieve-all.repository.js";
import { ResolutionEntity } from "../model/resolution.entity.js";
import { validate } from "../validation/create.validation.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";

export class CreateResolutionUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(document: DocumentInterface, images: any, options: CreateOptionsInterface) {
    try {
      // validate request body
      validate(document);
      // find user
      const retrieveUserRepository = new RetrieveUserRepository(this.db);
      const retrieveAllResolutionRepository = new RetrieveAllResolutionRepository(this.db);

      const findExistingResolution = await retrieveAllResolutionRepository.handle({
        fields: "",
        filter: { category_id: new ObjectId(document.category_id) },
        page: 1,
        pageSize: 999,
        sort: "",
      });
      if (findExistingResolution.data.length > 0) throw new ApiError(400, { msg: "One category for one resolution" });

      const userFind = await retrieveUserRepository.handle(document.user_id);
      const findCategory = userFind.categories?.findIndex((category) => category._id === document.category_id);
      if (!findCategory) throw new ApiError(400, { msg: "Category doesn't exist" });

      const imageUrls = await Promise.all(
        images?.map(async (image: Express.Multer.File) => {
          const path = image.path;
          const uploadRes = await uploader.upload(path, {
            folder: "think-action/posts",
            resource_type: "image",
            quality: 70,
          });
          await deleteFileAfterUpload(path);
          return uploadRes.secure_url;
        })
      );
      // save to database
      const resolutionEntity = new ResolutionEntity({
        user_id: userFind._id,
        resolution: document.resolution,
        images: imageUrls,
        category_id: document.category_id, // untuk sementara
        shareType: document.shareType,
        postType: "resolution",
        completed: false,
        dueDate: new Date(document.dueDate),
        createdAt: new Date(),
      });

      const response = await new CreateResolutionRepository(this.db).handle(resolutionEntity, options);
      // console.log(resolutionEntity);

      return {
        acknowledged: response.acknowledged,
        _id: response._id,
      };
    } catch (error) {
      throw error;
    }
  }
}
