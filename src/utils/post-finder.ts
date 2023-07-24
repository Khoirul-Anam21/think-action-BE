import { ApiError } from "@point-hub/express-error-handler";
import DatabaseConnection from "@src/database/connection.js";
import { RetrieveGoalRepository } from "@src/modules/goal/model/repository/retrieve.repository.js";
import { RetrieveResolutionRepository } from "@src/modules/resolution/model/repository/retrieve.repository.js"

export const FindPost = async (postType: string, postId: string, db: DatabaseConnection, options?: any) => {
  const retrieveResolutionRepository = new RetrieveResolutionRepository(db);
  const retrieveGoalRepository = new RetrieveGoalRepository(db);
  let result;
  switch (postType) {
    case 'resolution':
      result = await retrieveResolutionRepository.handle(postId, options);
      break;
    case 'goal':
      result = await retrieveGoalRepository.handle(postId, options);
      break;
    case 'completion':
      break;
    default:
      throw new ApiError(404, { msg: "post not found" });
      break;
  }
  return result;
}