import { Injectable } from '@nestjs/common';
import { Video } from '@prisma/client';
import { randomUUID } from 'crypto';
import { VideoUploadDTO } from 'src/videos/dto/video-upload.dto';
import { VideoWatchDTO } from 'src/videos/dto/video-watch.dto';
import { CategoryService } from 'src/videos/service/category.service';
import { VideoService } from 'src/videos/service/video.service';

@Injectable()
export class VideoApplicationService {
  constructor(
    private videoService: VideoService,
    private categoryService: CategoryService,
  ) {}

  async watchVideo(id: string): Promise<VideoWatchDTO> {
    const url: string = this.videoService.getVideoUrl(id);

    const videoMetadata: Video = await this.videoService.getVideoMetadata(id);

    return { url, videoMetadata };
  }

  async uploadVideo(
    fileName: string,
    title: string,
    description: string,
    categoryName: string,
  ): Promise<VideoUploadDTO> {
    const categoryRecord =
      await this.categoryService.getCategoryOrCreateNew(categoryName);

    const id: string = randomUUID();

    const uploadUrl: string = await this.videoService.getUploadUrl(
      fileName,
      id,
    );

    await this.videoService.saveVideoMetadata(
      title,
      description,
      id,
      categoryRecord.id,
    );

    return { uploadUrl: uploadUrl, videoId: id };
  }

  async getVideos(pageSize: number, pageNumber: number) {
    return await this.videoService.getVideos(pageSize, pageNumber);
  }
}
