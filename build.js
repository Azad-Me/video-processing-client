// build-and-upload.js
import { execSync } from "child_process";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// ---- CONFIG ----
const buildCommand = "npm run build"; // change to your build command
const buildDir = "./dist";            // change to your build folder (dist, build, etc.)
const bucketName = process.env.BUCKETNAME; // replace with your bucket
const region = process.env.REGION;          // your AWS region

// ---- STEP 1: Run Build ----
console.log("🚀 Running build...");
execSync(buildCommand, { stdio: "inherit" });

// ---- STEP 2: Upload to S3 ----
const s3 = new S3Client({ region });

async function uploadDirectory(directory, bucket, prefix = "") {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      await uploadDirectory(filePath, bucket, `${prefix}${file}/`);
    } else {
      const fileContent = fs.readFileSync(filePath);
      const key = `${prefix}${file}`;

      console.log(`📤 Uploading: ${key}`);

      const uploadParams = {
        Bucket: bucket,
        Key: key,
        Body: fileContent,
        ContentType: getContentType(file),
      };

      await s3.send(new PutObjectCommand(uploadParams));
    }
  }
}

function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case ".html": return "text/html";
    case ".js": return "application/javascript";
    case ".css": return "text/css";
    case ".json": return "application/json";
    case ".png": return "image/png";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    case ".svg": return "image/svg+xml";
    default: return "application/octet-stream";
  }
}

// Run upload
uploadDirectory(buildDir, bucketName)
  .then(() => console.log("✅ Build uploaded to S3 successfully!"))
  .catch(err => console.error("❌ Upload failed:", err));
