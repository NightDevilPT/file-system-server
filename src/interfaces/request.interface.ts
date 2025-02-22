import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: any; // You can replace `any` with a specific user type
}
