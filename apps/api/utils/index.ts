import 'dotenv';
import path from 'path';

export function getFilesFolderPath(dirname: string): string {
  return path.join(dirname, '..', '..', '..', 'files');
}

export function getFilePath(dirname: string, fileName: string): string {
  return path.join(dirname, '..', '..', '..', 'files', fileName);
}
