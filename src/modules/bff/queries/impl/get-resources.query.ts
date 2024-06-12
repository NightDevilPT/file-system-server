import { QueryDto } from "../../dtos/query.dto";

export class GetResourcesQuery {
  constructor(public readonly payload:QueryDto) {}
}
