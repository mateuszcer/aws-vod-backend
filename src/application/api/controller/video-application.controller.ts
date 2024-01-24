import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VideoApplicationService } from '../../service/video-application.service';
import { VideoWatchDTO } from 'src/videos/dto/video-watch.dto';
import { UploadRequest } from '../request/upload.request';
import { VideoUploadDTO } from 'src/videos/dto/video-upload.dto';
import { VideoMetadataDTO } from '../dto/video-metadata.dto';
import { CreatorMiddleware } from '../security/creator.middleware';

@Controller('videos')
export class VideoApplicationController {
  constructor(private videoApplicationService: VideoApplicationService) {}

  @Get('watch')
  async watchVideo(@Query('v') videoId: string): Promise<VideoWatchDTO> {
    return await this.videoApplicationService.watchVideo(videoId);
  }

  @Post('upload')
  @UseGuards(CreatorMiddleware)
  async uploadVideo(@Body() body: UploadRequest): Promise<VideoUploadDTO> {
    return await this.videoApplicationService.uploadVideo(body);
  }

  @Get('')
  @Header('Access-Control-Allow-Origin', '*')
  async getVideos(
    @Req() request: Request,
    @Query('category') category: string,
    @Query('ps') pageSize: number,
    @Query('p') pageNumber: number,
  ): Promise<VideoMetadataDTO[]> {
    return await this.videoApplicationService.getVideos(
      pageSize,
      pageNumber,
      category,
    );
  }
}
