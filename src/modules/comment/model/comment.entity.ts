import { ObjectId } from "mongodb";

export interface CommentEntityInterface {
  _id?: string;
  user_id?: string | ObjectId;
  post_id?: string | ObjectId;
  postType?: string;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CommentEntity implements CommentEntityInterface {
  public _id?: string;
  public user_id?: string | ObjectId;
  public post_id?: string | ObjectId;
  public postType?: string;
  public comment?: string;
  public createdAt?: Date | undefined;
  public updatedAt?: Date | undefined;

  constructor(comment: CommentEntityInterface) {
    this._id = comment._id;
    this.user_id = comment.user_id;
    this.post_id = comment.post_id;
    this.postType = comment.postType;
    this.comment = comment.comment;
    this.createdAt = comment.createdAt;
    this.updatedAt = comment.updatedAt;
  }
}

export interface ReplyEntityInterface {
  _id?: string;
  user_id?: string | ObjectId;
  comment_id?: string | ObjectId;
  reply_id?: string | ObjectId;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ReplyEntity implements ReplyEntityInterface {
  public _id?: string;
  public user_id?: string | ObjectId;
  public comment_id?: string | ObjectId;
  public reply_id?: string | ObjectId;
  public comment?: string;
  public createdAt?: Date | undefined;
  public updatedAt?: Date | undefined;

  constructor(reply: ReplyEntityInterface) {
    this._id = reply._id;
    this.user_id = reply.user_id;
    this.comment_id = reply.comment_id;
    this.reply_id = reply.reply_id;
    this.comment = reply.comment;
    this.createdAt = reply.createdAt;
    this.updatedAt = reply.updatedAt;
  }
}
