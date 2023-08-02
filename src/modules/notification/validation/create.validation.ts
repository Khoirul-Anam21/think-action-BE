import { ApiError } from "@point-hub/express-error-handler";
import Validatorjs from "validatorjs";
import { DocumentInterface } from "@src/database/connection.js";

// https://github.com/mikeerickson/validatorjs
export const validateCreateComment = (document: DocumentInterface) => {
  try {
    const validation = new Validatorjs(document, {
      user_id: "required|size:24",
      post_id: "required|size:24",
      postType: "required",
    });

    if (validation.fails()) {
      throw new ApiError(422, validation.errors.errors);
    }
  } catch (error) {
    throw error;
  }
};
