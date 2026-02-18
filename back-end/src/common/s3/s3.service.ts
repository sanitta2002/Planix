import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IS3Service } from './interfaces/s3.service.interface';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service implements IS3Service {
  private readonly s3: S3Client;
  private readonly bucketName: string;
  constructor(private readonly configService: ConfigService) {
    this.bucketName =
      this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');
    this.s3 = new S3Client({
      region: this.configService.getOrThrow<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>(
          'AWS_S3_Accesskey_ID',
        ),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_S3_Secret_accesskey',
        ),
      },
    });
  }
  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    folder = 'avatars',
  ): Promise<{ key: string }> {
    const key = `${folder}/${userId}${Date.now()}`;
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
      return { key };
    } catch {
      throw new InternalServerErrorException('S3 upload failed');
    }
  }
  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
    } catch {
      throw new InternalServerErrorException('S3 delete failed');
    }
  }
  async createSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    console.log(key);
    const url: string = await getSignedUrl(this.s3, command, { expiresIn });
    return url;
  }
}
