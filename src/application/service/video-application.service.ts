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
import { VideoMetadataRepository } from 'src/videos/repository/video-metadata.repository';

@Injectable()
export class VideoApplicationService {
  constructor(
    private videoService: VideoService,
    private categoryService: CategoryService,
    private dtoMapperService: DtoMapperService,
    private videoRepository: VideoMetadataRepository,
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
    const categoryRecords = await this.categoryService.getCategoriesOrCreateNew(
      uploadRequest.categories,
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
      categoryRecords.map((category) => category.id),
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
    category?: string,
  ): Promise<VideoMetadataDTO[]> {
    const videos: Video[] = await this.videoService.getVideos(
      pageSize - 0,
      pageNumber - 0,
      category,
    );

    return this.mapVideosToDtos(videos);
  }

  async getVideosByQuery(
    title: string,
    pageSize: number = 20,
    pageNumber: number = 1,
  ): Promise<VideoMetadataDTO[]> {
    const videos: Video[] = await this.videoService.getVideosByQuery(
      title,
      pageSize - 0,
      pageNumber - 0,
    );
    return this.mapVideosToDtos(videos);
  }

  private async mapVideosToDtos(videos: Video[]): Promise<VideoMetadataDTO[]> {
    return Promise.all(
      videos.map(async (video) => {
        const videoDto = this.dtoMapperService.mapVideoToDTO(video);
        videoDto.thumbnailUrl = this.videoService.getImageUrl(
          video.thumbnailUuid,
        );

        videoDto.categories = await this.videoRepository.getCategories(
          video.uuid,
        );

        return videoDto;
      }),
    );
  }
}
