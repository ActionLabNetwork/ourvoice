import { S3, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function generatePresignedUploadUrl(
  s3Client: S3,
  bucketName: string,
  key: string,
  expiresIn: number,
): Promise<string> {
  try {
    const command = new PutObjectCommand({ Bucket: bucketName, Key: key });
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    console.log(`Generated presigned upload URL: ${presignedUrl}`);
    return presignedUrl;
  } catch (error) {
    console.error(
      `Error generating presigned URL for ${key} in ${bucketName}`,
      error,
    );
    throw error;
  }
}

export async function generatePresignedDownloadUrl(
  s3Client: S3,
  bucketName: string,
  key: string,
  expiresIn: number,
): Promise<string> {
  try {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return presignedUrl;
  } catch (error) {
    console.error(
      `Error generating presigned download URL for ${key} in ${bucketName}`,
      error,
    );
    throw error;
  }
}
