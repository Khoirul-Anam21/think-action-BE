import { ObjectId } from "mongodb";

export interface CheerEntityInterface {
  _id?: string;
  post_id?: string | ObjectId;
  postType?: string;
  userCheerer_id?: string | ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CheerEntity implements CheerEntityInterface {
  public _id?: string;
  public post_id?: string | ObjectId;
  public postType?: string;
  public userCheerer_id?: string | ObjectId;
  public createdAt?: Date | undefined;
  public updatedAt?: Date | undefined;

  constructor(cheer: CheerEntityInterface) {
    this._id = cheer._id;
    this.post_id = cheer.post_id;
    this.postType = cheer.postType;
    this.userCheerer_id = cheer.userCheerer_id;
    this.createdAt = cheer.createdAt;
    this.updatedAt = cheer.updatedAt;
  }
}
