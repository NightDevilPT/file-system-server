import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class QueryService {
  generateQuery<T>(
    repository: Repository<T>,
    filters: Record<string, any>,
    sort?: string,
    page?: number,
    limit?: number,
    relations?: string[]
  ) {
    const entityName = repository.metadata.name;
    const queryBuilder = repository.createQueryBuilder(entityName);

    this.buildFilters(queryBuilder, filters);

    if (sort) {
      const sortOptions = this.buildSortOptions(sort);
      for (const [field, order] of Object.entries(sortOptions)) {
        queryBuilder.addOrderBy(`${queryBuilder.alias}.${field}`, order as 'ASC' | 'DESC');
      }
    }

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
    }

    if (relations && Array.isArray(relations)) {
      relations.forEach(relation => queryBuilder.leftJoinAndSelect(`${queryBuilder.alias}.${relation}`, relation));
    }

    return queryBuilder.getMany();
  }

  private buildFilters<T>(queryBuilder: SelectQueryBuilder<T>, filters: Record<string, any>) {
    Object.entries(filters).forEach(([field, conditions]) => {
      if (typeof conditions === 'object' && conditions !== null) {
        Object.entries(conditions).forEach(([operator, value]) => {
          switch (operator) {
            case 'eq':
              queryBuilder.andWhere(`${queryBuilder.alias}.${field} = :${field}`, { [field]: value });
              break;
            case 'ne':
              queryBuilder.andWhere(`${queryBuilder.alias}.${field} != :${field}`, { [field]: value });
              break;
            case 'gt':
              queryBuilder.andWhere(`${queryBuilder.alias}.${field} > :${field}`, { [field]: value });
              break;
            case 'lt':
              queryBuilder.andWhere(`${queryBuilder.alias}.${field} < :${field}`, { [field]: value });
              break;
            case 'gte':
              queryBuilder.andWhere(`${queryBuilder.alias}.${field} >= :${field}`, { [field]: value });
              break;
            case 'lte':
              queryBuilder.andWhere(`${queryBuilder.alias}.${field} <= :${field}`, { [field]: value });
              break;
            case 'like':
              queryBuilder.andWhere(`${queryBuilder.alias}.${field} LIKE :${field}`, { [field]: `%${value}%` });
              break;
            default:
              break;
          }
        });
      } else {
        queryBuilder.andWhere(`${queryBuilder.alias}.${field} ILIKE :${field}`, { [field]: `%${conditions}%` });
      }
    });
  }

  private buildSortOptions(sort: string) {
    const sortOptions: Record<string, 'ASC' | 'DESC'> = {};
    const sortFields = sort.split(',');
    sortFields.forEach(field => {
      const [key, order] = field.split(':');
      sortOptions[key] = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    });
    return sortOptions;
  }
}
