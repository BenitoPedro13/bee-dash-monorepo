// import { Campaign, Performance } from '@prisma/client';

export class CreateUserDto {
  email: string;
  name: string;
  password: string;
  urlProfilePicture?: string;
}
