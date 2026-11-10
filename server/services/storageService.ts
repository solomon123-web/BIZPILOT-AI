import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import env from '../config/env.js';

export type UploadableFile = {
  fieldname: string;
  originalname: string;
  filename: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer?: Buffer;
  path?: string;
};

export type StoredUpload = {
  key: string;
  url: string;
  provider: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

const uploadDir = path.resolve(process.cwd(), 'uploads');

const ensureUploadDirectory = async () => {
  await fs.mkdir(uploadDir, { recursive: true });
};

export const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-msvideo',
]);

export const maxBytesPerFile = 25 * 1024 * 1024;

export const validateUpload = (file: UploadableFile) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    throw new Error('Only image and video uploads are allowed.');
  }

  if ((file.size ?? 0) > maxBytesPerFile) {
    throw new Error('File exceeds the 25MB limit.');
  }
};

export const uploadFile = async (file: UploadableFile): Promise<StoredUpload> => {
  validateUpload(file);

  await ensureUploadDirectory();

  const hashed = crypto.createHash('sha256').update(`${Date.now()}-${file.originalname}-${Math.random()}`).digest('hex').slice(0, 16);
  const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-');
  const fileName = `${hashed}-${safeOriginalName}`;
  const filePath = path.join(uploadDir, fileName);

  if (file.buffer) {
    await fs.writeFile(filePath, file.buffer);
  } else if (file.path) {
    await fs.copyFile(file.path, filePath);
  } else {
    throw new Error('No file content was provided for upload.');
  }

  const publicBaseUrl = env.OBJECT_STORAGE_PUBLIC_BASE_URL || 'http://localhost:5000/uploads';
  const cleanBaseUrl = publicBaseUrl.replace(/\/$/, '');

  return {
    key: fileName,
    url: `${cleanBaseUrl}/${fileName}`,
    provider: env.OBJECT_STORAGE_PROVIDER || 'local',
    fileName,
    mimeType: file.mimetype,
    sizeBytes: file.size,
  };
};

export const deleteFile = async (key: string) => {
  const filePath = path.join(uploadDir, key);
  try {
    await fs.unlink(filePath);
  } catch (_error) {
    // Ignore missing files.
  }
};

export default {
  allowedMimeTypes,
  maxBytesPerFile,
  validateUpload,
  uploadFile,
  deleteFile,
};
