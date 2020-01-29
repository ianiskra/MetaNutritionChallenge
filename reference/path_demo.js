const path = require('path');

// Methods: Base File Name
console.log(path.basename(__filename));

// Methods: Directory Name
console.log(path.dirname(__filename));

// Methods: File Extension
console.log(path.extname(__filename));

// Method: Create path object
console.log(path.parse(__filename).base);

// Method: Concatenate paths
console.log(path.join(__dirname, 'test', 'hello.html'));