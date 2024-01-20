import { Category } from '@prisma/client';

export interface VideoMetadataDTO {
  title: string;
  description: string;
  videoId: string;
  productionYear: number;
  length: number;
  categories: Category[];
  thumbnailId: string;
  thumbnailUrl?: string;
}
