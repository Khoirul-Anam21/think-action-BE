import { ObjectId } from "mongodb";

export interface CompletionEntityInterface {
  _id?: string;
  user_id?: string | ObjectId;
  goal_id?: string | ObjectId;
  caption?: string;
  images?: string[];
  category_id?: ObjectId;
  shareType?: string;
  completedResolution?: boolean;
  postType?: string;
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CompletionEntity implements CompletionEntityInterface {
  public _id?: string;
  public user_id?: string | ObjectId | undefined;
  public caption?: string | undefined;
  public images?: string[];
  public category_id?: ObjectId;
  public goal_id?: string | ObjectId | undefined;
  public completedResolution?: boolean;
  public shareType?: string;
  public postType?: string | undefined;
  public dueDate?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(completion: CompletionEntityInterface) {
    this._id = completion._id;
    this.user_id = completion.user_id;
    this.caption = completion.caption;
    this.images = completion.images;
    this.category_id = completion.category_id;
    this.goal_id = completion.goal_id;
    this.shareType = completion.shareType;
    this.postType = completion.postType;
    this.completedResolution = completion.completedResolution;
    this.dueDate = completion.dueDate;
    this.createdAt = completion.createdAt;
    this.updatedAt = completion.updatedAt;
  }
}
