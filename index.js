/* Index.js Serves as the Server and handles routing 
Considered the backend*/
const http = require('http');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
let films = [];
let filmNames = new Set();

// Read the .csv file
fs.createReadStream('Film_Locations_in_San_Francisco.csv')
    .pipe(csv())
    .on('data', (row) => {
        // console.log(row);

        // Push row to films list
        films.push(row);

        // Will handle and discard repeats
        filmNames.add(row['Title']);
    })
    .on('end', () => {
        // Check to see if CSV file was read
        console.log('CSV file successfully processed');
        console.log(filmNames);
    });

const server = http.createServer((req, res) => {

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

            // At the VERY 1st space in film tilte
            if(parts[0] == 'filmTitle') {

                // User input for search
                let filmTitle = parts[1].toLowerCase();
                console.log(filmTitle);

                // Account for Films with spaces
                filmTitle = filmTitle.split('%20').join(' ');

                // Get list of locations from .csv file
                let locations = [];
                console.log(films.length);

                // Loop through the films for title
                for(let i = 0; i < films.length; i++){

                    let film = films[i];
                    console.log(film['Title'] + ' ' + filmTitle);

                    // title of film match search query
                    if (film['Title'].toLowerCase().includes(filmTitle) ){

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

            // Check unique Film Name
            else if (parts[0] == 'filmList'){
                let output = { "data": Array.from(filmNames) };
                console.log(output);
                
                // console.log('Boo YAh');

                // Sucessful client request to server
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(JSON.stringify(output), 'utf8');
                return;
            }
        }
    }

    // Read File - Delivers files to Front End based on URL requests
    fs.readFile(filePath, (err, content) => {
        
        // Check for Errors
        if(err){

            // Error Code ENOENT - Directory Not Found
            if(err.code == 'ENOENT'){

                // Page Not Found - Produce custom error page
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {

                    // Sucessful client request to server
                    res.writeHead(200, { 'Content-Type': 'text/html' });

                    // Loads Content
                    res.end(content, 'utf8');
                })
            }

            // 500 Error - Different Error
            else{
                // Some Server Error
                res.writeHead(500);

                // Loads Content
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

// Default value of Port or default to 5000
const PORT = process.env.PORT || 5000;

// Receives requested port
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));