import { CategoryEntityInterface } from "@src/modules/category/model/category.entity";

export interface UserEntityInterface {
  _id?: string;
  username?: string;
  email?: string;
  accountName?: string;
  photo?: string;
  accountType?: string;
  categories?: CategoryEntityInterface[];
  biography?: string;
  accessToken?: string;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDisplayInterface {
  _id?: string;
  accountName?: string;
  photo?: string;
}

export class UserEntity implements UserEntityInterface {
  public _id?: string;
  public username?: string;
  public email?: string;
  public accountName?: string;
  public photo?: string;
  public categories?: CategoryEntityInterface[];
  public biography?: string | undefined;
  public accountType?: string;
  public accessToken?: string;
  public refreshToken?: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(user: UserEntityInterface) {
    this._id = user._id;
    this.username = user.username;
    this.email = user.email;
    this.accountName = user.accountName;
    this.photo = user.photo;
    this.categories = user.categories;
    this.accountType = user.accountType;
    this.biography = user.biography;
    this.accessToken = user.accessToken;
    this.refreshToken = user.refreshToken;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
