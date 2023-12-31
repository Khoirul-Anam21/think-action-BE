import { ApiError } from "@point-hub/express-error-handler";
import Validatorjs from "validatorjs";
import { DocumentInterface } from "@src/database/connection.js";

// https://github.com/mikeerickson/validatorjs
export const validateId = (document: DocumentInterface = {}) => {
  try {
    const validation = new Validatorjs(document, {
      id: "required|size:24",
    });

    if (validation.fails()) {
      throw new ApiError(400, { msg: validation.errors.errors });
    }
  } catch (error) {
    throw error;
  }
};
