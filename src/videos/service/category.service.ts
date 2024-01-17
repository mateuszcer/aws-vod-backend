import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { CategoryRepository } from '../repository/category.repository';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async getCategoryOrCreateNew(categoryName: string): Promise<Category> {
    let categoryRecord: Category | null =
      await this.categoryRepository.findCategoryByName(categoryName);

    if (!categoryRecord)
      categoryRecord = await this.categoryRepository.save(categoryName);

    return categoryRecord;
  }
}
