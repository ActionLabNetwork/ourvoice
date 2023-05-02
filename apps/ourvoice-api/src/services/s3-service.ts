import { S3, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function generatePresignedUrl(
  s3Client: S3,
  bucketName: string,
  key: string,
  expiresIn: number,
): Promise<string> {
  try {
    const command = new PutObjectCommand({ Bucket: bucketName, Key: key });
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    console.log(`Generated presigned URL: ${presignedUrl}`);
    return presignedUrl;
  } catch (error) {
    console.error(
      `Error generating presigned URL for ${key} in ${bucketName}`,
      error,
    );
    throw error;
  }
}
