const { glob } = require('glob');
const fs = require('fs-extra');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'lib');

// Glob pattern to match all .js files
const pattern = 'src/*.js';  // This will match all .js files in the src folder and subfolders

// Create output directory if it doesn't exist
fs.ensureDirSync(distDir);

// Use glob to find all .js files in the src directory
glob(pattern, (err, files) => {
  if (err) {
    console.error('Error finding files:', err);
    return;
  }

  files.forEach((file) => {
    const destFile = path.join(distDir, path.relative(srcDir, file)); // Maintain directory structure

    // Ensure the destination directory exists
    fs.ensureDirSync(path.dirname(destFile));

    // Copy the file to the destination
    fs.copy(file, destFile, (err) => {
      if (err) {
        console.error('Error copying file:', err);
      } else {
        console.log(`Copied file: ${file} -> ${destFile}`);
      }
    });
  });
});
