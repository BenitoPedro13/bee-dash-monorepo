import {
  Injectable,
  Dependencies,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
@Dependencies(UsersService, JwtService)
export class AuthService {
  usersService: UsersService;
  jwtService: JwtService;

  constructor(usersService: UsersService, jwtService: JwtService) {
    this.usersService = usersService;
    this.jwtService = jwtService;
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByEmail(signInDto.email);
    if (user.password !== signInDto.password) {
      throw new UnauthorizedException();
    }

    const payload = { email: user.email, sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET, // Make sure to use the correct environment variable
      }),
      user: {
        userId: user.id,
        color: !user.color ? '' : user.color,
        urlProfilePicture: !user.urlProfilePicture
          ? ''
          : user.urlProfilePicture,
        email: user.email,
        name: user.name,
        campaignName: user.campaignName,
        totalInitialInvestment: user.totalInitialInvestment,
        estimatedExecutedInvestment: user.estimatedExecutedInvestment,
      },
    };
  }

  async getUserByToken(access_token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(access_token, {
        secret: process.env.JWT_SECRET, // Make sure to use the correct environment variable
      });

      const user = await this.usersService.findOne(decoded.sub);

      if (!user) {
        throw new UnauthorizedException();
      }

      return {
        user: {
          userId: user.id,
          color: !user.color ? '' : user.color,
          urlProfilePicture: !user.urlProfilePicture
            ? ''
            : user.urlProfilePicture,
          email: user.email,
          name: user.name,
          campaignName: user.campaignName,
          totalInitialInvestment: user.totalInitialInvestment,
          estimatedExecutedInvestment: user.estimatedExecutedInvestment,
        },
      };
    } catch (error) {
      console.log('error', error);
      throw new UnauthorizedException();
    }
  }
}
