import { Injectable } from '@nestjs/common';
import { Video } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma.service';

@Injectable()
export class VideoMetadataRepository {
  constructor(private readonly prisma: PrismaService) {}

  saveVideoMetadata(
    id: string,
    fileName: string,
    description: string,
    categoryRecordId: number,
  ): Promise<Video> {
    return this.prisma.video.create({
      data: {
        uuid: id,
        title: fileName,
        description,
        categories: {
          connect: { id: categoryRecordId },
        },
      },
    });
  }

  findVideoMetadata(id: string): Promise<Video> {
    return this.prisma.video.findUnique({
      where: { uuid: id },
    });
  }

  findVideos(pageSize: number, skip: number): Promise<Video[]> {
    return this.prisma.video.findMany({
      take: pageSize,
      skip: skip,
    });
  }
}
