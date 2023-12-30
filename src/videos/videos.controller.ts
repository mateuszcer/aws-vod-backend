import { Controller, Get, Query } from '@nestjs/common';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get('watch')
  watchVideo(@Query('v') videoId: string): object {
    return { url: this.videosService.getVideoUrl(videoId) };
  }
}
