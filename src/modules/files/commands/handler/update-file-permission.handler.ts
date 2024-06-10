import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, GoneException, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UpdateFilePermissionCommand } from '../impl/update-file-permission.command';
import { File } from '../../entities/file.entity';
import { isUUID } from 'class-validator';


@CommandHandler(UpdateFilePermissionCommand)
export class UpdateFilePermissionHandler implements ICommandHandler<UpdateFilePermissionCommand> {
  private readonly logger = new Logger(UpdateFilePermissionHandler.name);

  constructor(
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
  ) {}

  async execute(command: UpdateFilePermissionCommand): Promise<File> {
    this.logger.log(`Executing UpdateFilePermissionCommand for user ${command.userId}`);

    const { payload, userId, fileId } = command;
    const { isPrivate, userIds } = payload;

	if (!isUUID(fileId)) {
		throw new BadRequestException(`Invalid UUID format: ${fileId}`);
	  }

    try {
      const file = await this.fileRepo.findOne({where:{
		id:fileId
	  }})

      if (!file) {
        throw new NotFoundException('File not found');
      }

      if (isPrivate !== undefined) {
        file.isAccessable = isPrivate;
      }

      if(file.createdBy!==userId){
        throw new GoneException(`You don't have a permission to change Folder/File permission`)
      }


      if (isPrivate === 'ONLY' && Array.isArray(userIds)) {
        const newUserSet = userIds.filter((items)=>items!==userId)
        file.userIds = [...newUserSet]
      }

      const updatedFolder = await this.fileRepo.save(file);
      this.logger.log(`UpdateFilePermissionCommand executed successfully for user ${command.userId}`);
      return updatedFolder;
    } catch (error) {
      this.logger.error(`Failed to execute UpdateFilePermissionCommand for user ${command.userId}`, error.stack);
      throw error;
    }
  }
}
