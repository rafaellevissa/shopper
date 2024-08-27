import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface S3StorageOptions {
  region: string;
  bucketName: string;
}

export class S3Storage {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(options: S3StorageOptions) {
    this.s3Client = new S3Client({ region: options.region });
    this.bucketName = options.bucketName;
  }

  public async upload(
    buffer: Buffer,
    key: string,
    contentType: string = "image/jpeg"
  ): Promise<string> {
    const uploadParams = {
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    };

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));
      return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
    } catch (err) {
      console.error("Error uploading to S3", err);
      throw err;
    }
  }

  public async getObjectTemporaryLink(
    key: string,
    expiresInSeconds: number = 3600
  ): Promise<string> {
    const getObjectParams = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      const command = new GetObjectCommand(getObjectParams);
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      });
      return signedUrl;
    } catch (err) {
      console.error("Error generating signed URL", err);
      throw err;
    }
  }
}
