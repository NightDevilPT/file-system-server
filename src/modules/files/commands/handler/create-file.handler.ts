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
import { File, FileTypeEnum } from '../../entities/file.entity';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import { Folder } from 'src/modules/folders/entities/folder.entity';
import { FirebaseService } from 'src/services/firebase-service/firebase.service';
import { HashPasswordService } from 'src/services/hash-password/hash-password.service';
import { v4 as uuidv4 } from 'uuid';

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
    private readonly hashService: HashPasswordService,
  ) {}

  async execute(command: CreateFileCommand): Promise<any> {
    const { file, createFileDto, userId } = command;
    const { parentFolderId, name } = createFileDto;
    this.logger.log('Executing CreateFileCommand');

    if (!file) {
      throw new GoneException(`File not available`);
    }

    const fileModel = new File();
    fileModel.name = name;
    fileModel.size = file.size;
    fileModel.createdBy = userId;
    fileModel.id = uuidv4();

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
        folder.breadcrumb = [
          ...folder.breadcrumb,
          { name: fileModel.name, id: fileModel.id },
        ];
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

      this.logger.log(`File uploaded successfully to Firebase: ${fileUrl}`);
      fileModel.data = fileUrl;
      fileModel.fileType = this.getFileType(file)
      fileModel.shareToken =
        (await this.hashService.hashPassword(`${new Date().getTime()}`)) +
        ':FILE';

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

  private getFileType(file: Express.Multer.File): FileTypeEnum {
    const extension = file.originalname.split('.').pop().toLowerCase();
    const mimeType = file.mimetype.toLowerCase();
  
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
    const videoExtensions = ['mp4', 'avi', 'mkv', 'mov', 'wmv'];
  
    if (imageExtensions.includes(extension) || mimeType.startsWith('image/')) {
      return FileTypeEnum.IMAGE;
    }
    if (documentExtensions.includes(extension) || mimeType.startsWith('application/')) {
      return FileTypeEnum.DOCUMENT;
    }
    if (videoExtensions.includes(extension) || mimeType.startsWith('video/')) {
      return FileTypeEnum.VIDEO;
    }
    return FileTypeEnum.OTHER;
  }
  
}
