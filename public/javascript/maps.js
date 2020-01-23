/* This JavaScript File Will Contain the map and it's controls 

Maps JavaScript Reference: https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.zoom

*/

document.getElementById("hello") = "Hello World!";

// 1. Create JSON variables holding key-pair values on Locations
    // Utilize Values titles and locations from the .csv file

// 2. Variable Array to contain the JSON variables    

// 3. Setup location of San Fransisco by Latitude & Longitude
    // SF: 37.7749° N, 122.4194° W
var san_fran = { lat: 37.7749, lng: 122.4194 };

// 4. Use zoom property so map is centered at SF
// The initial Map zoom level.Required.Valid values: Integers between zero, and up to the supported