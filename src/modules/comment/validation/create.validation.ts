import { ApiError } from "@point-hub/express-error-handler";
import Validatorjs from "validatorjs";
import { DocumentInterface } from "@src/database/connection.js";

// https://github.com/mikeerickson/validatorjs
export const validateCreateComment = (document: DocumentInterface) => {
  try {
    const validation = new Validatorjs(document, {
      user_id: "required",
      post_id: "required",
      postType: "required",
      comment: "required",
    });

    if (validation.fails()) {
      throw new ApiError(422, validation.errors.errors);
    }
  } catch (error) {
    throw error;
  }
};

export const validateCreateCommentReply = (document: DocumentInterface) => {
  try {
    const validation = new Validatorjs(document, {
      user_id: "required",
      comment_id: "required",
      comment: "required",
    });

    if (validation.fails()) {
      throw new ApiError(422, validation.errors.errors);
    }
  } catch (error) {
    throw error;
  }
};
