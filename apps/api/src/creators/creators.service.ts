import { Injectable } from '@nestjs/common';
import { CreateCreatorDto } from './dto/create-creator.dto';
import { UpdateCreatorDto } from './dto/update-creator.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CreatorsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCreatorDto: CreateCreatorDto) {
    try {
      const creator = await this.prismaService.creator.create({
        data: createCreatorDto,
      });

      return creator;
    } catch (error) {
      console.error('CreatorsService.create: Error', error);
      throw error;
    }
  }

  findAll() {
    return `This action returns all creators`;
  }

  findOne(id: number) {
    return `This action returns a #${id} creator`;
  }

  update(id: number, updateCreatorDto: UpdateCreatorDto) {
    return `This action updates a #${id} creator`;
  }

  remove(id: number) {
    return `This action removes a #${id} creator`;
  }
}
