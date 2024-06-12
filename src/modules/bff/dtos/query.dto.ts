import { UUID } from "crypto";

// dto/filter.dto.ts
export class FilterDto {
  [key: string]: any;
}

// dto/query.dto.ts
export class QueryDto {
  resourceId:string
  filters?: string;
  sort?: string;
  page?: number;
  limit?: number;
}
