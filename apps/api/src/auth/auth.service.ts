import {
  Injectable,
  Dependencies,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { CampaignsService } from 'src/campaigns/campaigns.service';

@Injectable()
@Dependencies(UsersService, JwtService, CampaignsService)
export class AuthService {
  usersService: UsersService;
  campaignsService: CampaignsService;
  jwtService: JwtService;

  constructor(
    usersService: UsersService,
    jwtService: JwtService,
    campaignsService: CampaignsService,
  ) {
    this.usersService = usersService;
    this.jwtService = jwtService;
    this.campaignsService = campaignsService;
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByEmail(signInDto.email);
    if (user.password !== signInDto.password) {
      throw new UnauthorizedException();
    }

    const userCampaigns = await this.campaignsService.findAllByUserId(user.id);

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
        campaigns: userCampaigns,
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

      const userCampaigns = await this.campaignsService.findAllByUserId(
        user.id,
      );

      return {
        user: {
          userId: user.id,
          color: !user.color ? '' : user.color,
          urlProfilePicture: !user.urlProfilePicture
            ? ''
            : user.urlProfilePicture,
          // urlTable: !user.urlTable ? '' : user.urlTable,
          email: user.email,
          name: user.name,
          campaigns: userCampaigns,
          // totalInitialInvestment: user.totalInitialInvestment,
          // estimatedExecutedInvestment: user.estimatedExecutedInvestment,
        },
      };
    } catch (error) {
      console.log('error', error);
      throw new UnauthorizedException();
    }
  }
}
