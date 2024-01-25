import { Injectable } from '@nestjs/common';
import { Category, Video } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma.service';

@Injectable()
export class VideoMetadataRepository {
  constructor(private readonly prisma: PrismaService) {}

  saveVideoMetadata(
    id: string,
    title: string,
    description: string,
    categoriesIds: number[],
    length: number,
    productionYear: number,
    thumbnailId: string,
  ): Promise<Video> {
    return this.prisma.video.create({
      data: {
        uuid: id,
        title: title,
        description,
        categories: {
          connect: categoriesIds.map((categoryId: number) => {
            return { id: categoryId };
          }),
        },
        length: length,
        productionYear: productionYear,
        thumbnailUuid: thumbnailId,
      },
    });
  }

  findVideoMetadata(id: string): Promise<Video> {
    return this.prisma.video.findUnique({
      where: { uuid: id },
    });
  }

  findVideos(pageSize: number, skip2: number): Promise<Video[]> {
    return this.prisma.video.findMany({
      take: pageSize,
      skip: skip2,
    });
  }

  findVideosByCategory(
    pageSize: number,
    skip2: number,
    category: string,
  ): Promise<Video[]> {
    return this.prisma.video.findMany({
      take: pageSize,
      skip: skip2,
      where: {
        categories: {
          some: {
            name: category,
          },
        },
      },
    });
  }

  getCategories(videoId: string): Promise<Category[]> {
    return this.prisma.video
      .findUnique({
        where: { uuid: videoId },
      })
      .categories();
  }

  findVideosByTitleAndCategories(
    query: string,
    pageSize: number,
    skip: number,
  ): Promise<Video[]> {
    return this.prisma.video.findMany({
      take: pageSize,
      skip: skip,
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            categories: {
              some: {
                name: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            },
          },
        ],
      },
    });
  }
}
