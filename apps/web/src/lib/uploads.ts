import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';

const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

function getSafeExtension(file: File) {
  const rawExt = extname(file.name).toLowerCase();
  if (SUPPORTED_EXTENSIONS.has(rawExt)) {
    return rawExt;
  }

  switch (file.type) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    case 'image/gif':
      return '.gif';
    case 'image/avif':
      return '.avif';
    default:
      return null;
  }
}

export async function saveUploadedImage(file: File, folder: string) {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('Image exceeds the 8MB size limit.');
  }

  const extension = getSafeExtension(file);

  if (!extension) {
    throw new Error('Unsupported image file type.');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const relativeFolder = join('uploads', folder);
  const publicDir = join(process.cwd(), 'public', relativeFolder);

  await mkdir(publicDir, { recursive: true });

  const absolutePath = join(publicDir, filename);
  await writeFile(absolutePath, buffer);

  return `/${relativeFolder.replace(/\\/g, '/')}/${filename}`;
}
