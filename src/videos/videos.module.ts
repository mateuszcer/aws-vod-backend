import { Module } from '@nestjs/common';
import { VideoService } from './service/video.service';
import { CategoryService } from './service/category.service';
import { VideoMetadataRepository } from './repository/video-metadata.repository';
import { CategoryRepository } from './repository/category.repository';
import { PrismaService } from 'src/shared/prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    VideoService,
    CategoryService,
    VideoMetadataRepository,
    CategoryRepository,
    PrismaService,
  ],
  exports: [VideoService, CategoryService, VideoMetadataRepository],
})
export class VideosModule {}
