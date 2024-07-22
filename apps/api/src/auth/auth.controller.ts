import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('user')
  async getUserByToken(@Headers('authorization') authorization: string) {
    const token = authorization.replace('Bearer ', ''); // Remove 'Bearer ' prefix

    return await this.authService.getUserByToken(token);
  }
}
