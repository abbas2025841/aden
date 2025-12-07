// AdenLive App - Cleanup Script
import fs from 'fs';
import path from 'path';

const cleanupDirectories = [
  'D:\\Projects\\AdenLiveApp-Complete\\Data\\cache',
  'D:\\Projects\\AdenLiveApp-Complete\\Data\\temp',
  'D:\\Projects\\AdenLiveApp-Complete\\Data\\logs'
];

function cleanupDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory ${dirPath} does not exist, skipping...`);
    return;
  }

  try {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Keep directory structure but clean contents
        cleanupDirectory(filePath);
      } else {
        // Remove files older than 7 days
        const fileAge = Date.now() - stat.mtime.getTime();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        
        if (fileAge > sevenDays) {
          fs.unlinkSync(filePath);
          console.log(`Removed old file: ${filePath}`);
        }
      }
    }
    
    console.log(`Cleaned up directory: ${dirPath}`);
  } catch (error) {
    console.error(`Error cleaning directory ${dirPath}:`, error.message);
  }
}

console.log('Starting cleanup process...');
cleanupDirectories.forEach(cleanupDirectory);
console.log('Cleanup completed!');
