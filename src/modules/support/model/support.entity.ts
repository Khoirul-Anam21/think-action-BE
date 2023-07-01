import { UserDisplayInterface } from "@src/modules/user/model/user.entity";

export interface SupporterEntityInterface {
  _id?: string;
  user_id?: string;
  supporter?: UserDisplayInterface;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SupportingEntityInterface {
  _id?: string;
  user_id?: string;
  supporting?: UserDisplayInterface;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SupporterEntity implements SupporterEntityInterface {
  public _id?: string;
  public user_id?: string;
  public supporter?: UserDisplayInterface;
  public createdAt?: Date | undefined;
  public updatedAt?: Date | undefined;

  constructor(supporter: SupporterEntityInterface) {
    this._id = supporter._id;
    this.user_id = supporter.user_id;
    this.supporter = supporter.supporter;
    this.createdAt = supporter.createdAt;
    this.updatedAt = supporter.updatedAt;
  }
}

export class SupportingEntity implements SupportingEntityInterface {
  public _id?: string;
  public user_id?: string;
  public supporting?: UserDisplayInterface;
  public createdAt?: Date | undefined;
  public updatedAt?: Date | undefined;

  constructor(supporting: SupportingEntityInterface) {
    this._id = supporting._id;
    this.user_id = supporting.user_id;
    this.supporting = supporting.supporting;
    this.createdAt = supporting.createdAt;
    this.updatedAt = supporting.updatedAt;
  }
}
