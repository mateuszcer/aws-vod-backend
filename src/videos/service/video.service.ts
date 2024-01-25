import { Injectable } from '@nestjs/common';
import { getSignedUrl as getSignedUrlCloudfront } from '@aws-sdk/cloudfront-signer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as getS3SignedUrl } from '@aws-sdk/s3-request-presigner';
import { Video } from '@prisma/client';
import { VideoMetadataRepository } from '../repository/video-metadata.repository';

@Injectable()
export class VideoService {
  constructor(private videoRepository: VideoMetadataRepository) {}
  private s3Client = new S3Client({
    apiVersion: '2006-03-01',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
    region: process.env.BUCKET_REGION,
  });

  getVideoUrl(videoId: string): string {
    return getSignedUrlCloudfront({
      dateLessThan: new Date(Date.now() + 60 * 60 * 12).toISOString(),
      url: process.env.CLOUDFRONT_URL + '/' + videoId,
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    });
  }

  getImageUrl(imageId: string): string {
    return getSignedUrlCloudfront({
      dateLessThan: new Date(Date.now() + 60 * 60 * 12).toISOString(),
      url: process.env.CLOUDFRONT_URL + '/' + imageId,
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    });
  }

  getVideoMetadata(id: string): Promise<Video> {
    return this.videoRepository.findVideoMetadata(id);
  }

  getVideoUploadUrl(fileName: string, key: string): Promise<string> {
    const extension: string = fileName.split('.').pop();

    return this.getSignedUrl(key, `video/${extension}`);
  }

  getImageUploadUrl(fileName: string, key: string): Promise<string> {
    const extension: string = fileName.split('.').pop();

    return this.getSignedUrl(key, `image/${extension}`);
  }

  getSignedUrl(key: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });
    return getS3SignedUrl(this.s3Client, command, {
      expiresIn: 60 * 2,
    });
  }

  async saveVideoMetadata(
    title: string,
    description: string,
    id: string,
    categoriesIds: number[],
    length: number,
    productionYear: number,
    thumbnailId: string,
  ): Promise<Video> {
    try {
      return await this.videoRepository.saveVideoMetadata(
        id,
        title,
        description,
        categoriesIds,
        length,
        productionYear,
        thumbnailId,
      );
    } catch (error) {
      console.error(`Error saving video metadata: ${error.message}`);
    }
  }

  async getVideos(
    pageSize: number,
    pageNumber: number,
    category?: string,
  ): Promise<Video[]> {
    const skip = pageSize * (pageNumber - 1);
    if (category) {
      return this.videoRepository.findVideosByCategory(
        pageSize,
        skip,
        category,
      );
    }
    return this.videoRepository.findVideos(pageSize, skip);
  }

  async getVideosByTitle(
    title: string,
    pageSize: number,
    pageNumber: number,
  ): Promise<Video[]> {
    const skip = pageSize * (pageNumber - 1);
    return this.videoRepository.findVideosByTitle(title, pageSize, skip);
  }
}
