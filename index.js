/* Index.js Serves as the Server and handles routing */

const http = require('http');
const path = require('path');
const fs = require('fs');

const csv = require('csv-parser');
let films = [];
let filmNames = new Set();

// Read the csv file
fs.createReadStream('Film_Locations_in_San_Francisco.csv')
    .pipe(csv())
    .on('data', (row) => {
        // console.log(row);
        // Push row to films list
        films.push(row);

        // Will handle discard of repeats
        filmNames.add(row['Title']);
        
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
        console.log(filmNames);
    });



const server = http.createServer((req, res) => {

    // Test url for index.html
    // if(req.url === '/'){

    //     // Read html file
    //     fs.readFile(path.join(__dirname, 'public', 'index.html'), (err,
    //         content) => {

    //         // Check for error
    //         if(err) {throw err;}

    //         // Set status & content type
    //         res.writeHead(200, { 'Content-Type': 'text/html' });

    //         // Sever the HTML page
    //         res.end(content);
    //     })
    // }

    // // Test REST api, serving JSON
    // if (req.url === '/api/users') {

    // /* Normally fetch data from a database*/

    //     // Hardcode Users in JS Array
    //     const users = [
    //         { name: 'Bob Smith', age: 40 },
    //         { name: 'Jerry Taylor', age: 30 },
    //     ];
    //     // 200 Resp with JSON content
    //     res.writeHead(200, { 'Content-Type': 'application/json' });

    //     // Turn JavaScript object to JSON
    //     res.end(JSON.stringify(users));
    // }

    // Build File Path
    let filePath = path.join(__dirname, 
        'public', req.url === '/' ? 'index.html' : req.url );

    // Extension of file
    let extname = path.extname(filePath);

    // Initial Content
    let contentType = 'text/html';

    // Server Check ext and set content type
    switch(extname) {
        
        case '.js': 
            contentType = 'text/javascript';
            break;
        
        case '.css':
            contentType = 'text/css';
            break;

        case '.json':
            contentType = 'application/json';
            break;

        case '.png':
            contentType = 'image/png';
            break;

        case '.jpg':
            contentType = 'image/jpg';
            break;
        
        default :

        // respond to data requests
        if(extname.substring(0,6) == '.data?'){
            // Express 3 Version
            // let output = req.param("filmTitle");
            let query = extname.substring(6);
            
            // Spliting filmTitle
            let parts = query.split('=');

            if(parts[0] == 'filmTitle') {

                let filmTitle = parts[1];
                console.log(filmTitle);

                // Films withs spaces
                filmTitle = filmTitle.split('%20').join(' ');

                // Get list of locations from .csv file
                let locations = [];
                
                for(let i = 0; i < films.length; i++){

                    let film = films[i];

                    // title of film match search query
                    if(film['Title'] == filmTitle){

                        // add to it's film location
                        locations.push(film['Locations']);
                    }
                }

                // Reveals all locations of specified films
                console.log(locations);

                let output = { "data": locations };
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(JSON.stringify(output), 'utf8');
                return;
            }

            // Check unique film nam
            else if (parts[0] == 'filmList'){
                let output = { "data": Array.from(filmNames) };
                console.log(output);
                console.log('Boo YAh');
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(JSON.stringify(output), 'utf8');
                return;
            }
           
        }
    }


    // Read File - Delivers files to Front End based on URL requests
    fs.readFile(filePath, (err, content) => {
        // Check for Error
        if(err){
            // Error Code ENOENT - Not Found
            if(err.code == 'ENOENT'){
                // Page Not Found
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
                    // 200 response
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf8');
                })
            }

            // 500 Error - Different Error
            else{
                // Some Server Error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        }
        // No Error
        else{
            // Successful Response
            res.writeHead(200, { 'Content-Type': contentType });
            // Loads Content
            res.end(content, 'utf8');
        }
    });
});

// Port variable
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

