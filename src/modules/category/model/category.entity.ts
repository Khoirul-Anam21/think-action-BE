import { ObjectId } from "mongodb";

export interface CategoryEntityInterface {
  _id?: ObjectId | string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CategoryEntity implements CategoryEntityInterface {
  public _id?: ObjectId | string;
  public category?: string;
  public createdAt?: Date | undefined;
  public updatedAt?: Date | undefined;

  constructor(category: CategoryEntityInterface) {
    this._id = category._id;
    this.category = category.category;
    this.createdAt = category.createdAt;
    this.updatedAt = category.updatedAt;
  }
}
