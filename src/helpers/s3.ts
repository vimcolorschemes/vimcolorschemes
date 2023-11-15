import { Upload } from '@aws-sdk/lib-storage';
import { S3 } from '@aws-sdk/client-s3';

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || '',
  },
});

/*
 * Uploads an object to a specified S3 bucket
 *
 * @param {object} payload - What to upload
 * @param {string} bucket - The bucket name on S3
 * @param {string} key - The file key to upload the payload to
 */
async function upload(
  payload: any,
  bucket: string,
  key: string,
): Promise<void> {
  await remove(bucket, key);
  const body = JSON.stringify(payload);
  await new Upload({
    client: s3,
    params: { Bucket: bucket, Key: key, Body: body },
  }).done();
}

async function remove(bucket: string, key: string) {
  await s3.deleteObject({ Bucket: bucket, Key: key }, () => {});
}

const S3 = { upload };

export default S3;
