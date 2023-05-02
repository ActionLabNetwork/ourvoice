import { S3 } from '@aws-sdk/client-s3';

export const localstackEndpoint = 'http://localhost:4566';

export const s3 = new S3({
  apiVersion: '2006-03-01',
  endpoint: process.env.LOCALSTACK_ENDPOINT,
  region: process.env.AWS_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
