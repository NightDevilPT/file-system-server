// hash-password.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HashPasswordService } from './hash-password.service';
import { ConfigService } from '@nestjs/config';

describe('HashPasswordService', () => {
  let service: HashPasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashPasswordService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 10), // Mocking the get method to return salt rounds
          },
        },
      ],
    }).compile();

    service = module.get<HashPasswordService>(HashPasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should hash the password', async () => {
      const hashedPassword = await service.hashPassword('password');
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toEqual('password'); // Hashed password should not be equal to original password
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const hashedPassword = await service.hashPassword('password');
      const result = await service.verifyPassword('password', hashedPassword);
      expect(result).toBeTruthy();
    });

    it('should return false for incorrect password', async () => {
      const hashedPassword = await service.hashPassword('password');
      const result = await service.verifyPassword(
        'wrongpassword',
        hashedPassword,
      );
      expect(result).toBeFalsy();
    });
  });
});
