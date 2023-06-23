import { ObjectId } from "mongodb";
import { UserDisplayInterface } from "@src/modules/user/model/user.entity";

export interface ResolutionEntityInterface {
  _id?: string;
  user?: UserDisplayInterface;
  resolution?: string;
  images?: string[];
  category_id?: ObjectId;
  shareType?: string;
  completed?: boolean;
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ResolutionEntity implements ResolutionEntityInterface {
  public _id?: string;
  public user?: UserDisplayInterface;
  public resolution?: string;
  public images?: string[];
  public category_id?: ObjectId;
  public shareType?: string;
  public completed?: boolean;
  public dueDate?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(resolution: ResolutionEntityInterface) {
    this._id = resolution._id;
    this.user = resolution.user;
    this.images = resolution.images;
    this.category_id = resolution.category_id;
    this.shareType = resolution.shareType;
    this.completed = resolution.completed;
    this.dueDate = resolution.dueDate;
    this.createdAt = resolution.createdAt;
    this.updatedAt = resolution.updatedAt;
  }
}
