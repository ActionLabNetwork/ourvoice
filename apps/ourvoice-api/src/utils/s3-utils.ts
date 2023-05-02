import { Readable } from 'node:stream';
import { s3 } from '../config/s3-config';

export async function createBucket(bucketName: string): Promise<void> {
  try {
    await s3.createBucket({ Bucket: bucketName });
    console.log(`Bucket created: ${bucketName}`);
  } catch (error) {
    console.error(`Error creating bucket: ${bucketName}`, error);
  }
}

export async function uploadFile(
  bucketName: string,
  key: string,
  body: Readable,
): Promise<void> {
  try {
    await s3.putObject({ Bucket: bucketName, Key: key, Body: body });
    console.log(`File uploaded to bucket ${bucketName} with key ${key}`);
  } catch (error) {
    console.error(
      `Error uploading file to bucket ${bucketName} with key ${key}`,
      error,
    );
  }
}
