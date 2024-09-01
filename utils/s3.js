import { S3Client } from "@aws-sdk/client-s3";

const createS3Client = () => {
    const s3 = new S3Client({
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
        region: process.env.BUCKET_LOCATION,
    });
    return s3;
};
export default createS3Client;
