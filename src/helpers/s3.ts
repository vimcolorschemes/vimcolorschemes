import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.GATSBY_AWS_S3_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.GATSBY_AWS_S3_SECRET_ACCESS_KEY || '',
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
  await s3.upload({ Bucket: bucket, Key: key, Body: body }).promise();
}

async function remove(bucket: string, key: string) {
  await s3.deleteObject({ Bucket: bucket, Key: key }, () => {}).promise();
}

const S3 = { upload };

export default S3;
