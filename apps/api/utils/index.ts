import 'dotenv';
import path from 'path';

export function getFilesFolderPath(dirname: string): string {
  //   if (process.env.NODE_ENV === 'development') {
  return path.join(dirname, '..', '..', '..', 'files');
  //   }

  //   return path.join(dirname, '..', '..', 'files');
}

export function getFilePath(dirname: string, fileName: string): string {
  //   if (process.env.NODE_ENV === 'development') {
  return path.join(dirname, '..', '..', '..', 'files', fileName);
  //   }

  //   return path.join(dirname, '..', '..', 'files', fileName);
}
