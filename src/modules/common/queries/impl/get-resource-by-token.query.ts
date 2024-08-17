import { QueryDto } from '../../dtos/query.dto';

export class GetResourceByTokenQuery {
  constructor(
    public readonly token: string,
    public readonly userId: string,
  ) {}
}
