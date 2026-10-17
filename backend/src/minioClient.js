const Minio = require('minio');
require('dotenv').config();

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT) || 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin123'
});

const ensureBucket = async (bucketName) => {
    try {
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            await minioClient.makeBucket(bucketName, 'us-east-1');
            
            // Set bucket policy to public read
            const policy = {
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: 'Allow',
                        Principal: { AWS: ['*'] },
                        Action: ['s3:GetBucketLocation', 's3:ListBucket', 's3:ListBucketMultipartUploads'],
                        Resource: [`arn:aws:s3:::${bucketName}`]
                    },
                    {
                        Effect: 'Allow',
                        Principal: { AWS: ['*'] },
                        Action: [
                            's3:GetObject',
                            's3:ListMultipartUploadParts',
                            's3:PutObject',
                            's3:AbortMultipartUpload',
                            's3:DeleteObject'
                        ],
                        Resource: [`arn:aws:s3:::${bucketName}/*`]
                    }
                ]
            };
            await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
            console.log(`Bucket "${bucketName}" created and made public.`);
        }
    } catch (err) {
        console.error('Error ensuring bucket exists:', err);
    }
};

module.exports = { minioClient, ensureBucket };
