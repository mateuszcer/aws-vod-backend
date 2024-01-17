import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideosModule } from './videos/videos.module';
import { ConfigModule } from '@nestjs/config';
import { VideoApplicationController } from './application/api/controller/video-application.controller';
import { VideoApplicationService } from './application/service/video-application.service';

@Module({
  imports: [VideosModule, ConfigModule.forRoot()],
  controllers: [AppController, VideoApplicationController],
  providers: [AppService, VideoApplicationService],
})
export class AppModule {}
