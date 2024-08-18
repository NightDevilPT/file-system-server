import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { History } from 'src/modules/history/entities/history.entity';
import { GetHistoryQuery } from '../impl/get-history.query';

@QueryHandler(GetHistoryQuery)
export class GetHistoryHandler implements IQueryHandler<GetHistoryQuery> {
  constructor(
    @InjectRepository(History)
    private readonly historyRepo: Repository<History>,
  ) {}

  async execute(query: GetHistoryQuery) {
    const { userId, page, limit } = query;

    // Calculate the offset for pagination
    const skip = (page - 1) * limit;

    // Fetch history data with pagination, filtering by userId
    const histories = await this.historyRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' }, // Assuming history has a createdAt field
      skip,
      take: limit,
    });

    // Fetch total history count for the user
    const totalCount = await this.historyRepo.count({
      where: { userId },
    });

    // Calculate metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page * limit < totalCount;
    const nextPage = hasNext ? page + 1 : null;
    const hasPrevious = page > 1;
    const previousPage = hasPrevious ? page - 1 : null;

    return {
      histories,
      metadata: {
        totalCount,
        totalPages,
        nextPage,
        previousPage,
      },
    };
  }
}
