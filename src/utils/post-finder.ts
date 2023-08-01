import { ApiError } from "@point-hub/express-error-handler";
import DatabaseConnection from "@src/database/connection.js";
import { RetrieveCompletionRepository } from "@src/modules/completion/model/repository/retrieve.repository.js";
import { RetrieveGoalRepository } from "@src/modules/goal/model/repository/retrieve.repository.js";
import { RetrieveResolutionRepository } from "@src/modules/resolution/model/repository/retrieve.repository.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";

export const FindPost = async (
  postType: string,
  postId: string,
  db: DatabaseConnection,
  options?: any
) => {
  const retrieveResolutionRepository = new RetrieveResolutionRepository(db);
  const retrieveGoalRepository = new RetrieveGoalRepository(db);
  const retrieveCompletionRepository = new RetrieveCompletionRepository(db);
  const retrieveUserRepository = new RetrieveUserRepository(db);
  let result;
  switch (postType) {
    case "resolution":
      result = await retrieveResolutionRepository.handle(postId, options);
      break;
    case "goal":
      result = await retrieveGoalRepository.handle(postId, options);
      break;
    case "completion":
      result = await retrieveCompletionRepository.handle(postId, options);
      break;
    default:
      throw new ApiError(404, { msg: "post not found" });
  }
  const user = await retrieveUserRepository.handle(result.user_id as string);
  const userData = {
    id: user._id,
    accountName: user.accountName,
    photo: user.photo,
  };
  return { ...result, user: userData };
};
