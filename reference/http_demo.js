const http = require('http');

// Create server object
http.createServer((req, res) => {
    // Write response
    res.write('Hello World');
    res.end();

    // Web Server at port 5000, server connnection
}).listen(5000, () => console.log('Server Running...'));