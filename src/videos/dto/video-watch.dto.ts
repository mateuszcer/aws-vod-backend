import { VideoMetadataDTO } from 'src/application/api/dto/video-metadata.dto';

export interface VideoWatchDTO {
  watchUrl: string;
  videoMetadata: VideoMetadataDTO;
}
