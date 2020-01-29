const fs = require('fs');
const path = require('path');

// Create folder
// fs.mkdir(path.join(__dirname, '/test'), {}, err => {
//     // Check for error
//     if(err) throw err;
    
//     // Otherwise
//     console.log('Folder created...');
// });


// Create Files and Write to
// fs.writeFile(
//     path.join(__dirname, '/test', 'hello.txt'), 
//     'Hello World!', 
//     err => {
//     // Check for error
//     if (err) throw err;

//     // Otherwise
//     console.log('File written too...');

//     // Append File
//     fs.appendFile(
//         path.join(__dirname, '/test', 'hello.txt'),
//             ' I love Node.js!',
//             err => {
//                 // Check for error
//                 if (err) throw err;

//                 // Otherwise
//                 console.log('File written too...');
//         });
// });

// Read File
// fs.readFile(path.join(__dirname, '/test', 'hello.txt'), 'utf8', (err, data) => {
//     if(err) throw err;
//     console.log(data);
// });

// Rename File
fs.rename(path.join(__dirname, '/test', 'hello.txt'), path.join(__dirname, '/test', 'helloworld.txt'), (err) => {
    if (err) throw err;
    console.log('File renammed...');
});