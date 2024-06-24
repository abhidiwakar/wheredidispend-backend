import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async generatePresignedURL(key: string, bucket?: string): Promise<string> {
    const command = new GetObjectCommand({
      Key: key,
      Bucket: bucket ?? process.env.AWS_S3_BUCKET_NAME,
    });

    const url = await getSignedUrl(this.client, command, { expiresIn: 3600 });
    return url;
  }

  async uploadFile(file: File, folder: string) {
    const fileName = `${folder}/${file.name}`;
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: file,
    };
    const result = await this.client.send(new PutObjectCommand(uploadParams));
    return result;
  }
}
