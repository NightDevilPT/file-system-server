import { Profile } from "../entities/profile.entity";

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface Response {
  message: string;
}

export interface ProfileResponse extends Response{
  data:Profile | Profile[]
}

export interface UserData {
  id: string;
}

export interface UserRequest extends Request {
  user: UserData;
}

export enum StorageType {
	DEFAULT="DEFAULT",
	BASIC="BASIC",
	ADVACED="ADVANCED"
}