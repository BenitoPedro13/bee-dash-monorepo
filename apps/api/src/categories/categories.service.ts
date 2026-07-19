import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.prisma.categories.create({
        data: {
          category: createCategoryDto.category,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(category: string | null = null) {
    try {
      const where: Prisma.CategoriesWhereInput = category
        ? {
            category: {
              contains: category,
              mode: 'insensitive',
            },
          }
        : undefined;

      const result = await this.prisma.categories.findMany({ where });
      const total = await this.prisma.categories.count({ where });

      return { result, total };
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.categories.findUnique({
        where: { id },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.prisma.categories.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.categories.delete({ where: { id } });
    } catch (error) {
      console.log(error);
    }
  }
}
