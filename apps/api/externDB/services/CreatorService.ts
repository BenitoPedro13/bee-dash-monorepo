import {
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { query } from '../index';

export interface ICreatorsSearch {
  creator_id: string;
  id: string;
  image: string;
  name: string;
  profile: string;
  state: string;
  postCount?: number;
}

export class CreatorService {
  public async getCreatorById(input: string) {
    try {
      if (!input) {
        throw new BadRequestException('`Input` query parameter is required ');
      }

      const queryString = `
        SELECT users.id, creators.id AS creator_id, social_newtorks.profile, users.name, users.image, users.city
        FROM creators
        LEFT JOIN users ON users.id = creators.user_id
        LEFT JOIN social_newtorks ON social_newtorks.creator_id = creators.id
        WHERE creators.id = $1
      `;

      const result = await query(queryString, [input]);

      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
