const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "auto",

  // ⚠️ IMPORTANT: account-level endpoint ONLY
  endpoint: process.env.R2_ENDPOINT,
  
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },

  // ❌ MUST BE FALSE FOR R2
  forcePathStyle: false,
});

module.exports = s3;
