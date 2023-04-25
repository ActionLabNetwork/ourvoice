import { S3 } from '@aws-sdk/client-s3';

export const localstackEndpoint = 'http://localhost:4566';

export const s3 = new S3({
  apiVersion: '2006-03-01',
  endpoint: localstackEndpoint,
  region: 'us-east-1',
  forcePathStyle: true,
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
});
