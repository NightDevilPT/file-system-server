// src/file-upload/handlers/upload-file.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Logger,
  NotFoundException,
  InternalServerErrorException,
  GoneException,
} from '@nestjs/common';
import { CreateFileCommand } from '../impl/create-file.command';
import { File } from '../../entities/file.entity';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import { Folder } from 'src/modules/folders/entities/folder.entity';
import { FirebaseService } from 'src/services/firebase-service/firebase.service';

@CommandHandler(CreateFileCommand)
export class CreateFileHandler implements ICommandHandler<CreateFileCommand> {
  private readonly logger = new Logger(CreateFileHandler.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
  ) {}

  async execute(command: CreateFileCommand): Promise<any> {
    const { file, createFileDto, userId } = command;
    const { parentFolderId, name } = createFileDto;
    this.logger.log('Executing CreateFileCommand');

	if(!file){
		throw new GoneException(`File not available`)
	}

    const fileModel = new File();
    fileModel.name = name;
    fileModel.size = file.size;
    fileModel.createdBy = userId;

    try {
      if (parentFolderId) {
        console.log('parentFolderId');
        this.logger.log(`Looking for folder with ID: ${parentFolderId}`);
        const folder = await this.folderRepository.findOne({
          where: { id: parentFolderId },
        });
        if (!folder) {
          this.logger.error(`Folder not found with ID: ${parentFolderId}`);
          throw new NotFoundException(
            `Folder not found with ID: ${parentFolderId}`,
          );
        }
        fileModel.parentFolder = folder;
        fileModel.resourceId = folder.id;
      } else {
        console.log('parenELSEtFolderId');
        this.logger.log(`Looking for profile for user ID: ${userId}`);
        const profile = await this.profileRepository.findOne({
          where: { user: { id: userId } },
        });
        if (!profile) {
          this.logger.error(`Profile not found for user ID: ${userId}`);
          throw new NotFoundException(
            `Profile not found for user ID: ${userId}`,
          );
        }
        fileModel.parentProfile = profile;
        fileModel.resourceId = profile.id;
      }

      const fileUrl = await this.firebaseService.uploadFile(file);

      console.log('parentFolderId');
      this.logger.log(`File uploaded successfully to Firebase: ${fileUrl}`);
      fileModel.data = fileUrl;
      this.logger.log('Saving file entity to the database');
      const savedFile = await this.fileRepository.save(fileModel);
      this.logger.log(
        `File entity saved successfully with ID: ${savedFile.id}`,
      );
      return savedFile;
    } catch (error) {
      this.logger.error(
        `Failed to execute CreateFileCommand: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to upload and save the file',
      );
    }
  }
}