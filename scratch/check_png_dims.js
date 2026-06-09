const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Audrey Darmawan/Documents/Programming/ExpoGo/ExpoGo/assets/RecordingResultAssets';

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.png')) {
        const filePath = path.join(dir, file);
        const buffer = fs.readFileSync(filePath);
        // Read PNG width and height
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);
        console.log(`${file}: ${width}x${height}`);
    }
});
