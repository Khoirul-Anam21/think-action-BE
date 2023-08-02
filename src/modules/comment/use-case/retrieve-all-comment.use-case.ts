import { ObjectId } from "mongodb";
import DatabaseConnection, { RetrieveAllOptionsInterface } from "@src/database/connection.js";
import { RetrieveUserRepository } from "@src/modules/user/model/repository/retrieve.repository.js";

export class RetrieveAllCommentsUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(post_id: any, postType: any, options?: RetrieveAllOptionsInterface, page = 1, limit = 10) {
    try {
      // soon
      const commentPipeline = [
        {
          '$match': {
            'post_id': new ObjectId('64bdd520bce39c71c13dccf2'), 
            'postType': 'resolution'
          }
        }, {
          '$lookup': {
            'from': 'users', 
            'localField': 'user_id', 
            'foreignField': '_id', 
            'as': 'user'
          }
        }, {
          '$unwind': {
            'path': '$user', 
            'preserveNullAndEmptyArrays': false
          }
        }, {
          '$unset': [
            'user.accessToken', 'user.refreshToken', 'user.createdAt', 'user.username', 'user.email', 'user.categories', 'user_id'
          ]
        }
      ];

      const replyPipeline = [
        {
          '$match': {
            'comment_id': new ObjectId('64bf3929dab6a5e4827b7ccc')
          }
        }, {
          '$lookup': {
            'from': 'users', 
            'localField': 'user_id', 
            'foreignField': '_id', 
            'as': 'user'
          }
        }, {
          '$unwind': {
            'path': '$user', 
            'preserveNullAndEmptyArrays': false
          }
        }, {
          '$unset': [
            'user_id', 'user.categories', 'user.refreshToken', 'user.accessToken', 'user.createdAt', 'user.updatedAt', 'user.email', 'user.username'
          ]
        }
      ]
    } catch (error) {
      throw error;
    }
  }
}
