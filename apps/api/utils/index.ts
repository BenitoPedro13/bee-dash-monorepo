import fs from 'fs';

import 'dotenv';
import path from 'path';

export function getFilesFolderPath(dirname: string): string {
  return path.join(dirname, '..', '..', '..', 'files');
}

export function getFilePath(dirname: string, fileName: string): string {
  return path.join(dirname, '..', '..', '..', 'files', fileName);
}

export async function listFilesWithSubstring(
  directory: string,
  substring: string,
): Promise<string | undefined> {
  try {
    const files = await fs.promises.readdir(directory);

    // Filter files that contain the substring
    const matchingFiles = files.filter((file) => file.includes(substring));

    // Get file with the largest number at the start
    const file = getFileWithLargestNumber(matchingFiles);

    return file;
  } catch (err) {
    console.error('Error reading directory:', err);
    return undefined;
  }
}

function getFileWithLargestNumber(files: string[]) {
  const fileWithLargestNumber = files.reduce((maxFile, currentFile) => {
    // Extract the number at the beginning of each file name
    const currentNumber = parseInt(currentFile.split('-')[0], 10);
    const maxNumber = parseInt(maxFile.split('-')[0], 10);

    // Return the file with the larger number
    return currentNumber > maxNumber ? currentFile : maxFile;
  });

  return fileWithLargestNumber;
}
