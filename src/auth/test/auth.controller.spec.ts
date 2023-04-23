import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationResponse, UserDto } from '../user.dto';
import { User } from '../user.schema';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, {
        provide: getModelToken(User.name),
        useValue: {},
      }, {
          provide: JwtService,
          useValue: {},
        }]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('loginUser', () => {

    it('should return user authentication model ', async () => {
      //Arrange
      const userDto = { email: "test@test.com", password: "123456" } as UserDto;
      const authResponse = { email: "test@test.com", accessToken: "jwt-token" } as AuthenticationResponse;
      jest.spyOn(service, 'loginUser').mockResolvedValue(authResponse);

      //Act
      const result = await controller.login(userDto);

      //Assert
      expect(result.data).toEqual(authResponse);
      expect(result.succeeded).toBe(true);
    });
  })

  describe('registerUser', () => {
   
    it('should return registered user authentication model ', async () => {
      //Arrange
      const userDto = { email: "test@test.com", password: "123456" } as UserDto;
      const authResponse = { email: "test@test.com", accessToken: "jwt-token" } as AuthenticationResponse;
      jest.spyOn(service, 'registerUser').mockResolvedValue(authResponse);

      //Act
      const result = await controller.registerUser(userDto);

      //Assert
      expect(result.data).toEqual(authResponse);
      expect(result.succeeded).toBe(true);
    });
  })
});
