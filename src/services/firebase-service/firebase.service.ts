// src/firebase/firebase.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import * as path from 'path';

@Injectable()
export class FirebaseService {
  private firebaseApp: FirebaseApp;

  constructor(private configService: ConfigService) {
    const firebaseConfig = {
      apiKey: this.configService.get<string>('FIREBASE_API_KEY'),
      authDomain: this.configService.get<string>('FIREBASE_AUTH_DOMAIN'),
      projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      storageBucket: this.configService.get<string>('FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: this.configService.get<string>('FIREBASE_MESSAGING_SENDER_ID'),
      appId: this.configService.get<string>('FIREBASE_APP_ID'),
      measurementId: this.configService.get<string>('FIREBASE_MEASUREMENT_ID'),
    };

    this.firebaseApp = initializeApp(firebaseConfig);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const storage = getStorage(this.firebaseApp);
    const currentDate = new Date().toISOString().replace(/[:.]/g, '-');
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const newFileName = `${baseName}-${currentDate}${ext}`;
    const storageRef = ref(storage, `file-storage-files/${newFileName}`);
    await uploadBytesResumable(storageRef, file.buffer);
    const fileUrl = await getDownloadURL(storageRef);
    return fileUrl;
  }

  async uploadAvtar(file: Express.Multer.File): Promise<string> {
    const storage = getStorage(this.firebaseApp);
    const currentDate = new Date().toISOString().replace(/[:.]/g, '-');
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const newFileName = `${baseName}-${currentDate}${ext}`;
    const storageRef = ref(storage, `file-storage-avtar/${newFileName}`);
    await uploadBytesResumable(storageRef, file.buffer);
    const fileUrl = await getDownloadURL(storageRef);
    return fileUrl;
  }

  // New method to delete a file from Firebase Storage
  async deleteFile(filePath: string): Promise<void> {
    const storage = getStorage(this.firebaseApp);
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
  }
}
