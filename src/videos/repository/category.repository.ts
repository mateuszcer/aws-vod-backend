import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCategoryByName(categoryName: string): Promise<Category> {
    return this.prisma.category.findUnique({
      where: { name: categoryName },
    });
  }

  async save(categoryName: string): Promise<Category> {
    return this.prisma.category.create({
      data: {
        name: categoryName,
      },
    });
  }
}
