import { Video } from '@prisma/client';

export interface VideoWatchDTO {
  url: string;
  videoMetadata: Video;
}
