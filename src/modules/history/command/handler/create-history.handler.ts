import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateHistoryCommand } from '../impl/create-history.command';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from '../../entities/history.entity';
import { Repository } from 'typeorm';


@CommandHandler(CreateHistoryCommand)
export class CreateHistoryHandler implements ICommandHandler<CreateHistoryCommand> {
  constructor(
	@InjectRepository(History)
    private readonly historyRepo: Repository<History>,
  ) {}

  async execute(command: CreateHistoryCommand): Promise<void> {
    const { resourceId, eventName, from, to } = command;
	const historyPayload = new History();
	historyPayload.eventName = eventName
	historyPayload.resourceId = resourceId
	historyPayload.userId = resourceId;
	this.historyRepo.save(historyPayload)
  }
}