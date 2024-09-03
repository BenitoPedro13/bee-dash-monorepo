import { PartialType } from '@nestjs/mapped-types';
import { CreatePostsPackDto } from './create-posts-pack.dto';

export class UpdatePostsPackDto extends PartialType(CreatePostsPackDto) {}
