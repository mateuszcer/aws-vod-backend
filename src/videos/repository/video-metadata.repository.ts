import { Injectable } from '@nestjs/common';
import { Video } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma.service';

@Injectable()
export class VideoMetadataRepository {
  constructor(private readonly prisma: PrismaService) {}

  saveVideoMetadata(
    id: string,
    title: string,
    description: string,
    categoryRecordId: number,
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
          connect: { id: categoryRecordId },
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
}
