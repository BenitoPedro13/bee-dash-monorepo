import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from 'src/users/users.service';
import { CampaignsService } from 'src/campaigns/campaigns.service';
import { CreatorsService } from 'src/creators/creators.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  providers: [
    AuthService,
    JwtService,
    UsersService,
    CampaignsService,
    CreatorsService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
