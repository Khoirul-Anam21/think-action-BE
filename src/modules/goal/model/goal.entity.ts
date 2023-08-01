import { ObjectId } from "mongodb";

export interface GoalEntityInterface {
  _id?: string;
  user_id?: string | ObjectId;
  goal?: string;
  images?: string[];
  category_id?: string | ObjectId;
  shareType?: string;
  postType?: string;
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class GoalEntity implements GoalEntityInterface {
  public _id?: string;
  public user_id?: string | ObjectId | undefined;
  public goal?: string;
  public images?: string[];
  public category_id?: string | ObjectId;
  public shareType?: string;
  public postType?: string | undefined;
  public dueDate?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(goal: GoalEntityInterface) {
    this._id = goal._id;
    this.user_id = goal.user_id;
    this.goal = goal.goal;
    this.images = goal.images;
    this.category_id = goal.category_id;
    this.shareType = goal.shareType;
    this.postType = goal.postType;
    this.dueDate = goal.dueDate;
    this.createdAt = goal.createdAt;
    this.updatedAt = goal.updatedAt;
  }
}
