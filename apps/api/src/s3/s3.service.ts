import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const KEY_LIST_TTL_MS = 60_000;

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly bucket = process.env.AWS_S3_BUCKET_NAME;
  private keyListCache: { keys: string[]; fetchedAt: number } | null = null;

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT_URL,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async upload(key: string, body: Buffer, contentType?: string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
    this.invalidateKeyList();
  }

  async getObject(
    key: string,
  ): Promise<{ stream: Readable; contentType?: string; contentLength?: number }> {
    const response = await this.client.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
    );

    return {
      stream: response.Body as Readable,
      contentType: response.ContentType,
      contentLength: response.ContentLength,
    };
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
    this.invalidateKeyList();
  }

  invalidateKeyList(): void {
    this.keyListCache = null;
  }

  private async listAllKeys(): Promise<string[]> {
    if (
      this.keyListCache &&
      Date.now() - this.keyListCache.fetchedAt < KEY_LIST_TTL_MS
    ) {
      return this.keyListCache.keys;
    }

    const keys: string[] = [];
    let continuationToken: string | undefined;

    do {
      const response = await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          ContinuationToken: continuationToken,
        }),
      );
      keys.push(...(response.Contents ?? []).map((object) => object.Key));
      continuationToken = response.IsTruncated
        ? response.NextContinuationToken
        : undefined;
    } while (continuationToken);

    this.keyListCache = { keys, fetchedAt: Date.now() };
    return keys;
  }

  /**
   * Mirrors the old local-disk `listFilesWithSubstring`: finds the matching
   * key with the largest leading timestamp and returns it as a `/public/...`
   * link, or '' if nothing matches.
   */
  async findPublicUrlBySubstring(substring: string): Promise<string> {
    const keys = await this.listAllKeys();
    const matching = keys.filter((key) => key.includes(substring));

    if (matching.length === 0) {
      return '';
    }

    const newest = matching.reduce((max, current) => {
      const currentNumber = parseInt(current.split('-')[0], 10);
      const maxNumber = parseInt(max.split('-')[0], 10);
      return currentNumber > maxNumber ? current : max;
    });

    return `/public/${newest}`;
  }
}
