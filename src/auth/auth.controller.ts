import { Controller, Body, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationResponse, UserDto } from './user.dto';
import { ResponseGeneric } from 'src/utilities/dtos/response.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiBody({ type: UserDto })
  @ApiResponse({ type: ResponseGeneric<AuthenticationResponse> })
  async registerUser(@Body() req: UserDto): Promise<ResponseGeneric<AuthenticationResponse>> {
    const data = await this.authService.registerUser(req);
    return new ResponseGeneric<AuthenticationResponse>(data);
  }


  @Post('login')
  @ApiBody({ type: UserDto })
  @ApiResponse({ type: ResponseGeneric<AuthenticationResponse> })
  async login(@Body() req: UserDto) {
    let data = await this.authService.loginUser(req);
    return new ResponseGeneric<AuthenticationResponse>(data);
  }
}
