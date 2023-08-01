import { ObjectId } from "mongodb";

export interface NotificationEntityInterface {
  _id?: string;
  post_id?: string | ObjectId;
  postType?: string;
  user_id?: string | ObjectId;
  userNotified_id?: string | ObjectId;
  read?: boolean;
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NotificationRequest {
  user_id: string;
  post_id?: string;
  postType?: string;
  userNotified?: string;
  messageType: string;
}

export class NotificationEntity implements NotificationEntityInterface {
  public _id?: string;
  public post_id?: string | ObjectId;
  public postType?: string;
  public user_id?: string | ObjectId;
  public userNotified_id?: string | ObjectId;
  public read?: boolean | undefined;
  public message?: string | undefined;
  public createdAt?: Date | undefined;
  public updatedAt?: Date | undefined;

  constructor(notification: NotificationEntityInterface) {
    this._id = notification._id;
    this.post_id = notification.post_id;
    this.postType = notification.postType;
    this.user_id = notification.user_id;
    this.userNotified_id = notification.userNotified_id;
    this.message = notification.message;
    this.read = notification.read;
    this.createdAt = notification.createdAt;
    this.updatedAt = notification.updatedAt;
  }
}
