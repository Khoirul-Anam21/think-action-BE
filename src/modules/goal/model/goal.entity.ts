import { ObjectId } from "mongodb";
import { UserDisplayInterface } from "@src/modules/user/model/user.entity";

export interface GoalEntityInterface {
  _id?: string;
  user?: UserDisplayInterface;
  resolution_id?: ObjectId;
  goal?: string;
  images?: string[];
  category_id?: ObjectId;
  shareType?: string;
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class GoalEntity implements GoalEntityInterface {
  public _id?: string;
  public user?: UserDisplayInterface;
  public resolution_id?: ObjectId;
  public goal?: string;
  public images?: string[];
  public category_id?: ObjectId;
  public shareType?: string;
  public dueDate?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(goal: GoalEntityInterface) {
    this._id = goal._id;
    this.user = goal.user;
    this.resolution_id = goal.resolution_id;
    this.goal = goal.goal;
    this.images = goal.images;
    this.category_id = goal.category_id;
    this.shareType = goal.shareType;
    this.dueDate = goal.dueDate;
    this.createdAt = goal.createdAt;
    this.updatedAt = goal.updatedAt;
  }
}
