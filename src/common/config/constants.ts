export const application = {
  port: process.env.APP_PORT,
  geminiToken: process.env.GEMINI_API_KEY as string,
};

export const database = {
  hostname: process.env.DB_HOSTNAME,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
};

export const aws = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  region: process.env.AWS_REGION as string,
  s3: {
    bucketName: process.env.AWS_BUCKET_S3 as string,
  },
};
