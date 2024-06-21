import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateHistoryCommand } from '../impl/create-history.command';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from '../../entities/history.entity';
import { Repository } from 'typeorm';
import { SharedEvents } from 'src/modules/command-events/events';
import { Profile } from 'src/modules/profiles/entities/profile.entity';


@CommandHandler(CreateHistoryCommand)
export class CreateHistoryHandler implements ICommandHandler<CreateHistoryCommand> {
  constructor(
	@InjectRepository(History)
    private readonly historyRepo: Repository<History>,
	@InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}

  async execute(command: CreateHistoryCommand): Promise<void> {
    const { resourceId, eventName, from, to } = command;
	const historyPayload = new History();
	historyPayload.eventName = eventName;
	historyPayload.resourceId = resourceId;
	if(eventName===SharedEvents.ProfileCreatedEvent || eventName===SharedEvents.ProfileUpdatedEvent){
		historyPayload.userId = await this.getUserIdFromProfile(resourceId);
	}else{
		historyPayload.userId = resourceId;
	}
	if(from){
		historyPayload.from = from;
	}
	if(to){
		historyPayload.to = to;
	}
	this.historyRepo.save(historyPayload)
  }

  async getUserIdFromProfile(id:string){
	const findUser = await this.profileRepo.findOne({where:{id},relations:['user']});
	return findUser.user.id;
  }
}