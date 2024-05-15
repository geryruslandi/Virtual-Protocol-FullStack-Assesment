import { Body, Controller, Post, Res } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from '@api/auth/auth.dto';
import { AuthService } from '@api/auth/auth.service';
import { ResponseService } from '@api/utils/response.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private service: AuthService,
    private response: ResponseService,
  ) {}

  @Post('register')
  async register(@Body() data: RegisterDTO) {
    const user = await this.service.registerUser(data);
    return {
      message: 'testing',
      data: { user },
    };
  }

  @Post('login')
  async login(@Body() data: LoginDTO, @Res() res: Response) {
    const user = await this.service.loginUser(data);

    if (!user) {
      return this.response.unathorized(res, 'Username or password missmatch');
    }

    const token = await this.service.generateBearerToken(user);

    return this.response.ok(res, {
      user,
      token,
    });
  }
}
