import { Injectable } from '@nestjs/common';
import { Video } from '@prisma/client';
import { randomUUID } from 'crypto';
import { VideoUploadDTO } from 'src/videos/dto/video-upload.dto';
import { VideoWatchDTO } from 'src/videos/dto/video-watch.dto';
import { CategoryService } from 'src/videos/service/category.service';
import { VideoService } from 'src/videos/service/video.service';
import { DtoMapperService } from '../mapper/dto-mapper.service';
import { VideoMetadataDTO } from '../api/dto/video-metadata.dto';
import { UploadRequest } from '../api/request/upload.request';

@Injectable()
export class VideoApplicationService {
  constructor(
    private videoService: VideoService,
    private categoryService: CategoryService,
    private dtoMapperService: DtoMapperService,
  ) {}

  async watchVideo(id: string): Promise<VideoWatchDTO> {
    const watchUrl: string = this.videoService.getVideoUrl(id);

    const videoMetadata: Video = await this.videoService.getVideoMetadata(id);

    return {
      watchUrl,
      videoMetadata: this.dtoMapperService.mapVideoToDTO(videoMetadata),
    };
  }

  async uploadVideo(uploadRequest: UploadRequest): Promise<VideoUploadDTO> {
    const categoryRecord = await this.categoryService.getCategoryOrCreateNew(
      uploadRequest.categoryName,
    );

    const videoId: string = randomUUID();
    const thumbnailId: string = randomUUID();

    const videoUploadUrl: string = await this.videoService.getVideoUploadUrl(
      uploadRequest.fileName,
      videoId,
    );

    const thumbnailUploadUrl: string =
      await this.videoService.getImageUploadUrl(
        uploadRequest.thumbnailFilename,
        thumbnailId,
      );

    await this.videoService.saveVideoMetadata(
      uploadRequest.title,
      uploadRequest.description,
      videoId,
      categoryRecord.id,
      uploadRequest.length,
      uploadRequest.productionYear,
      thumbnailId,
    );

    return {
      uploadUrl: videoUploadUrl,
      videoId: videoId,
      thumbnailUploadUrl: thumbnailUploadUrl,
    };
  }

  async getVideos(
    pageSize: number = 20,
    pageNumber: number = 1,
  ): Promise<VideoMetadataDTO[]> {
    return (
      await this.videoService.getVideos(pageSize - 0, pageNumber - 0)
    ).map((video) => {
      const videoDto = this.dtoMapperService.mapVideoToDTO(video);
      videoDto.thumbnailUrl = this.videoService.getImageUrl(
        video.thumbnailUuid,
      );
      return videoDto;
    });
  }
}
