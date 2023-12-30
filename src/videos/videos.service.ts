import { Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';

@Injectable()
export class VideosService {
  getVideoUrl(videoId: string): string {
    return getSignedUrl({
      dateLessThan: new Date(Date.now() + 60 * 60 * 12).toISOString(),
      url: process.env.CLOUDFRONT_URL + '/' + videoId,
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    });
  }
}
