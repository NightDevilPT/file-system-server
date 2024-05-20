import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';

describe('JwtAuthService', () => {
  let service: JwtAuthService;
  let configService: ConfigService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'JWT_SECRET':
                  return 'secretKey';
                case 'JWT_EXPIREIN':
                  return '1d';
              }
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<JwtAuthService>(JwtAuthService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const payload = { userId: 1 };
      const token = 'generated.jwt.token';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const generatedToken = service.generateToken(payload);

      expect(generatedToken).toBe(token);
      expect(jwtService.sign).toHaveBeenCalledWith(payload, {
        secret: 'secretKey',
        expiresIn: '1d',
      });
    });
  });

  describe('verifyToken', () => {
    it('should verify a JWT token', () => {
      const token = 'some.jwt.token';
      const decodedToken = { userId: 1 };
      jest.spyOn(jwtService, 'verify').mockReturnValue(decodedToken);

      const verifiedToken = service.verifyToken(token);

      expect(verifiedToken).toEqual(decodedToken);
      expect(jwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'secretKey',
      });
    });
  });
});
