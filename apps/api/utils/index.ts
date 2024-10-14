import fs from 'fs';

import 'dotenv';
import path from 'path';

export function getFilesFolderPath(dirname: string): string {
  return path.join(dirname, '..', '..', '..', 'files');
}

export function getFilePath(dirname: string, fileName: string): string {
  return path.join(dirname, '..', '..', '..', 'files', fileName);
}

const cache: Record<string, string> = {}; // Cache object

// Invalidate the cache for a specific substring
export function invalidateCache(substring: string) {
  if (cache[substring]) {
    console.log(`Invalidating cache for substring: ${substring}`);
    delete cache[substring];
  }
}

export function listFilesWithSubstring(substring: string): string {
  // Check if the result is already cached
  if (cache[substring]) {
    console.log(`Returning cached result for substring: ${substring}`);
    return cache[substring];
  }

  const directoryPath = path.join(__dirname, '..', '..', 'files');
  const files = fs.readdirSync(directoryPath);

  // Filter files that contain the substring
  const matchingFiles = files.filter((file) => file.includes(substring));

  console.log('matchingFiles', matchingFiles);

  // Get file with the largest number at the start
  const file = getFileWithLargestNumber(matchingFiles);

  // Cache the result
  cache[substring] = file;

  return file;
}

function getFileWithLargestNumber(files: string[]) {
  if (files.length === 0) {
    return '';
  }

  const fileWithLargestNumber = files.reduce((maxFile, currentFile) => {
    // Extract the number at the beginning of each file name
    const currentNumber = parseInt(currentFile.split('-')[0], 10);
    const maxNumber = parseInt(maxFile.split('-')[0], 10);

    // Return the file with the larger number
    return currentNumber > maxNumber ? currentFile : maxFile;
  });

  return '/public/' + fileWithLargestNumber;
}
