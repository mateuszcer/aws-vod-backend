import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { VideoApplicationService } from '../../service/video-application.service';
import { VideoWatchDTO } from 'src/videos/dto/video-watch.dto';
import { UploadRequest } from '../request/upload.request';
import { VideoUploadDTO } from 'src/videos/dto/video-upload.dto';

@Controller('videos')
export class VideoApplicationController {
  constructor(private videoApplicationService: VideoApplicationService) {}

  @Get('watch')
  async watchVideo(@Query('v') videoId: string): Promise<VideoWatchDTO> {
    return await this.videoApplicationService.watchVideo(videoId);
  }

  @Post('upload')
  async uploadVideo(@Body() body: UploadRequest): Promise<VideoUploadDTO> {
    return await this.videoApplicationService.uploadVideo(
      body.fileName,
      body.title,
      body.description,
      body.categoryName,
    );
  }

  @Get('')
  async getVideos(pageSize: number, @Query('p') pageNumber: number) {
    return await this.videoApplicationService.getVideos(20, pageNumber);
  }
}
