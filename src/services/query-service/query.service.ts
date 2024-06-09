import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SelectQueryBuilder } from 'typeorm';

@Injectable()
export class QueryService {
  private databaseType: string;

  constructor(private configService: ConfigService) {
    this.databaseType = this.configService.get<string>('DATABASE_TYPE');
  }

  buildQuery(filters: Record<string, any>, populate?: string): any {
    // if (this.databaseType === 'mongo') {
    //   return this.buildMongoQuery(filters, populate);
    // } else {
    //   return this.buildPostgresQuery(filters, populate);
    // }
    return this.buildMongoQuery(filters, populate);
  }

  private buildMongoQuery(filters: Record<string, any>, populate?: string): any {
    const query: any = {};
    const populateFields = populate ? populate.split(',') : [];

    if (filters) {
      for (const [field, criteria] of Object.entries(filters)) {
        if (typeof criteria === 'object') {
          for (const [operator, value] of Object.entries(criteria)) {
            if (!query[field]) {
              query[field] = {};
            }
            switch (operator) {
              case '$eq':
                query[field] = value;
                break;
              case '$ne':
              case '$gt':
              case '$gte':
              case '$lt':
              case '$lte':
              case '$in':
              case '$nin':
                query[field][operator] = value;
                break;
              default:
                throw new Error(`Unsupported operator: ${operator}`);
            }
          }
        } else if (typeof criteria === 'string') {
          query[field] = { $regex: new RegExp(`^${criteria}`), $options: 'i' }; // Partial matching for Mongo
        } else {
          query[field] = criteria;
        }
      }
    }

    return { query, populateFields };
  }

  private buildPostgresQuery(filters: Record<string, any>, populate?: string): SelectQueryBuilder<any> {
    let queryBuilder: SelectQueryBuilder<any>; // Initialize this with your query builder
    const populateFields = populate ? populate.split(',') : [];

    if (filters) {
      Object.entries(filters).forEach(([field, condition]) => {
        if (typeof condition === 'object') {
          Object.entries(condition).forEach(([operator, value]) => {
            switch (operator) {
              case '$eq':
                queryBuilder.andWhere(`${field} = :${field}`, { [field]: value });
                break;
              case '$ne':
                queryBuilder.andWhere(`${field} != :${field}`, { [field]: value });
                break;
              case '$gt':
                queryBuilder.andWhere(`${field} > :${field}`, { [field]: value });
                break;
              case '$gte':
                queryBuilder.andWhere(`${field} >= :${field}`, { [field]: value });
                break;
              case '$lt':
                queryBuilder.andWhere(`${field} < :${field}`, { [field]: value });
                break;
              case '$lte':
                queryBuilder.andWhere(`${field} <= :${field}`, { [field]: value });
                break;
              case '$in':
                queryBuilder.andWhere(`${field} IN (:...${field})`, { [field]: value });
                break;
              case '$nin':
                queryBuilder.andWhere(`${field} NOT IN (:...${field})`, { [field]: value });
                break;
              default:
                throw new Error(`Unsupported operator: ${operator}`);
            }
          });
        } else {
          queryBuilder.andWhere(`${field} = :${field}`, { [field]: condition });
        }
      });
    }

    // Apply population
    populateFields.forEach(field => {
      queryBuilder.leftJoinAndSelect(field, field);
    });

    return queryBuilder;
  }
}
