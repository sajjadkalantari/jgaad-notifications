import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../user.schema';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../user.dto';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userModel;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useFactory: () => ({
            sign: jest.fn(() => 'jwt-token'),
            verify: jest.fn(() => ({ userId: 1 })),
          })
        }],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken('User'));
  });

  describe('registerUser', () => {

    it('should throw email request model validation error', async () => {
      //Arrange
      const registerModel = { email: 'test.com', password: '123456' } as UserDto;

      //Act & Arrange
      await expect(service.registerUser(registerModel)).rejects.toThrow("invalid request");
    });

    it('should throw invalid request', async () => {
      //Arrange
      const registerModel = { email: 'test@test.com', password: '123456' } as UserDto;
      jest.spyOn(userModel, 'create').mockReturnValue(null);

      //Act & Arrange
      await expect(service.registerUser(registerModel)).rejects.toThrow("invalid request");
      expect(userModel.create).toBeCalled();
    });

    it('should return access token', async () => {
      //Arrange
      const registerModel = { email: 'test@test.com', password: '123456' } as UserDto;
      jest.spyOn(userModel, 'create').mockReturnValue(registerModel);

      //Act
      const response = await service.registerUser(registerModel);

      //Act & Arrange
      expect(response).toEqual({
        accessToken: 'jwt-token',
        email: 'test@test.com',
        expiresIn: 60
      });
    });

  });


  describe('loginUser', () => {

    it('should throw email request model validation error', async () => {
      //Arrange
      const loginModel = { email: 'test.com', password: '123456' } as UserDto;

      //Act & Arrange
      await expect(service.loginUser(loginModel)).rejects.toThrow("invalid request");
    });

    it('should throw user not found exception', async () => {
      //Arrange
      const loginModel = { email: 'test@test.com', password: '123456' } as UserDto;
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockReturnValue({ exec: jest.fn().mockReturnValue(null) }),
      } as any);
      
      //Act & Arrange
      await expect(service.loginUser(loginModel)).rejects.toThrow("user not found");
    });

    it('should throw user not found exception because passwords is not same', async () => {
      //Arrange
      const loginModel = { email: 'test@test.com', password: '123456' } as UserDto;
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockReturnValue({ exec: jest.fn().mockReturnValue(loginModel) }),
      } as any);
      
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      //Act & Arrange
      await expect(service.loginUser(loginModel)).rejects.toThrow("user not found");
      expect(bcrypt.compare).toBeCalled();
    });

    it('should return access token', async () => {
      //Arrange
      const loginModel = { email: 'test@test.com', password: '123456' } as UserDto;
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockReturnValue({ exec: jest.fn().mockReturnValue(loginModel) }),
      } as any);
      //Act
      const response = await service.registerUser(loginModel);

      //Act & Arrange
      expect(response).toEqual({
        accessToken: 'jwt-token',
        email: 'test@test.com',
        expiresIn: 60
      });
    });

  });
});


const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};