import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  private client: S3Client;
  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
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
