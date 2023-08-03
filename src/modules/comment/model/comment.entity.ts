import { ObjectId } from "mongodb";

export interface CommentInterface {
  _id?: string;
  user_id?: string;
  post_id?: string;
  postType?: string;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CommentEntity implements CommentInterface {
  public _id?: string | undefined;
  public user_id?: string | undefined;
  public post_id?: string | undefined;
  public postType?: string | undefined;
  public comment?: string | undefined;
  public createdAt?: Date | undefined;
  public updatedAt?: Date | undefined;

  constructor(comment: CommentInterface) {
    this._id = comment._id;
    this.user_id = comment.user_id;
    this.post_id = comment.post_id;
    this.postType = comment.postType;
    this.comment = comment.comment;
    this.createdAt = comment.createdAt;
    this.updatedAt = comment.updatedAt;
  }
}

export interface CommentReplyInterface {
  _id?: string;
  comment_id?: string;
  reply_id?: string;
  user_id?: string;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CommentReplyEntity implements CommentReplyInterface {
  public _id: string | undefined;
  public comment_id?: string | undefined;
  public reply_id?: string | undefined;
  public user_id?: string | undefined;
  public comment?: string | undefined;
  public createdAt?: Date | undefined;
  public updatedAt?: Date | undefined;

  constructor(commentReply: CommentReplyInterface) {
    this._id = commentReply._id;
    this.comment_id = commentReply.comment_id;
    this.reply_id = commentReply.reply_id;
    this.user_id = commentReply.user_id;
    this.comment = commentReply.comment;
    this.createdAt = commentReply.createdAt;
    this.updatedAt = commentReply.updatedAt;
  }
}
