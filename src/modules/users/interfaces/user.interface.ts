import { UUID } from 'crypto';

export interface userResponseInterface {
  message: string;
}

export interface loginUserResponse extends userResponseInterface {
  data?: {
    id: string;
  };
}
