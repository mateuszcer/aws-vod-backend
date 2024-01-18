import { Injectable } from '@nestjs/common';
import { Video } from '@prisma/client';
import { VideoMetadataDTO } from '../api/dto/video-metadata.dto';

@Injectable()
export class DtoMapperService {
  constructor() {}

  mapVideoToDTO(video: Video): VideoMetadataDTO {
    return {
      thumbnailId: video.thumbnailUuid,
      title: video.title,
      description: video.description,
      videoId: video.uuid,
      productionYear: video.productionYear,
      length: video.length,
    };
  }
}
