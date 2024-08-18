// src/storage/storage.service.ts
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private totalStorageSize: number; // Total storage size in KB

  constructor(private configService: ConfigService) {
    // Retrieve the total storage size from the environment and convert it to KB
    this.totalStorageSize = this.configService.get<number>('TOTAL_STORAGE_SIZE') || 51200;
  }

  /**
   * Updates the storage when a file is uploaded.
   * @param file - The file being uploaded
   * @param availableStorage - The current available storage in KB
   * @returns - An object with updated available storage or false if storage exceeds the limit
   */
  updateStorageOnUpload(
    file: Express.Multer.File,
    availableStorage: number,
  ): { availableStorage: number } | false {
    const fileSizeInKB = file.size / 1024; // Convert bytes to KB

    if (fileSizeInKB + availableStorage > this.totalStorageSize) {
      return false; // Not enough storage available
    }

    const updatedStorage = fileSizeInKB + availableStorage;

    return { availableStorage: updatedStorage };
  }

  /**
   * Updates the storage when a file is deleted.
   * @param file - The file being deleted
   * @param availableStorage - The current available storage in KB
   * @returns - An object with updated available storage
   */
  updateStorageOnDelete(
    file: Express.Multer.File,
    availableStorage: number,
  ): { availableStorage: number } {
    const fileSizeInKB = file.size / 1024; // Convert bytes to KB

    const updatedStorage = availableStorage - fileSizeInKB;

    return { availableStorage: updatedStorage };
  }
}
