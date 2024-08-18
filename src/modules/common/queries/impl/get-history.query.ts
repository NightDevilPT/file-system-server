import { QueryDto } from '../../dtos/query.dto';

export class GetHistoryQuery {
  constructor(
    public readonly userId: string,
    public readonly page: number = 1,   // Default page is 1
    public readonly limit: number = 10, // Default limit is 10
  ) {}
}
