export interface UserEntityInterface {
  _id?: string;
  username?: string;
  email?: string;
  displayName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserEntity implements UserEntityInterface {
  public _id?: string;
  public username?: string;
  public email?: string;
  public displayName?: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(user: UserEntityInterface) {
    this._id = user._id;
    this.username = user.username;
    this.email = user.email;
    this.displayName = user.displayName;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
