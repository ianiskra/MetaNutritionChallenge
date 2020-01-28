/* Objective: Create a service that shows on a map where movies have been filmed in San Francisco. 
 * The user should be able to filter the view using autocompletion search. The data is available 
 * on the Film_Locations_in_San_Francisco.csv
 * 
 * Maps JavaScript Reference: https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.zoom
 * Autocomplete for Addresses and Search Terms: https://developers.google.com/maps/documentation/javascript/places-autocomplete
 * Geoservices: https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com?q=geocoding&id=42fea2de-420b-4bd7-bd89-225be3b8b7b0&project=meta-nutrition-challenge&folder&organizationId
 * Request & Response Geocoding API: https://developers.google.com/maps/documentation/geocoding/start
 * 
*/
/* maps.js is embedded in the browswer itself for the front-end purposes */

// Global variables 
let films = [];
let myMap;
let markers = []; 

// Remove markers upon new search
function clearMarkers() {
    
    // Loop through the existing markers
    for(let i = 0; i < markers.length; i++){
        
        // remove markers
        markers[i].setMap(null);
    }
    // Clears
    markers = [];
}

// API Callback Function
function initMap() {

    // SF: 37.7749° N, 122.4194° W
    var sanFran = { lat: 37.7600, lng: -122.4194 };

    // Map centered at SF
    myMap = new google.maps.Map(
        
        // center map at SF
        document.getElementById('map'),
        { zoom: 13, center: sanFran});
}

// Perfomrs Search Requests of Movie Locations
function doSearch() {
    
    // Will clear existing results if any
    clearMarkers();

    // User Movie Search
    let search = document.getElementById('filmTitle').value;
    console.log(search);

    // Retrive data from server
    var xmlhttp = new XMLHttpRequest();
    var url = "find.data?filmTitle=" + search;
    console.log(url);    
    xmlhttp.onreadystatechange = function() {
    
        // Check status of XMLHttpRequest
        if (this.readyState == 4 && this.status == 200) {

            // Receive text of film title
            var myArr = JSON.parse(this.responseText)['data'];
            console.log(myArr);

            let filmOutput = '<ul>';
            
            // Loop through all locations associated with film
            for(let i = 0; i < myArr.length; i++){
                let location = myArr[i];
                console.log(location);

                // Returns Bulletpoint Results of location
                filmOutput += '<li>' + location + '</li>';

                // This allows us for Marker on Map at Location
                var subURL = 'https://maps.googleapis.com/maps/api/geocode/json?address='+encodeURIComponent(location)+',+San+Francisco,+CA,+94108&key=AIzaSyADDvb3DJSN8Zvdf-XZQ_-HiT8YzlSY6Lc';

                // Test subUrl in JSON format
                console.log(subURL);

                // For Location Request
                var subxmlhttp = new XMLHttpRequest();

                // Event handler for readystate of location request
                subxmlhttp.onreadystatechange = function() {

                    // Check status of XMLHttpRequest
                    if(this.readyState == 4 && this.status == 200) {
                        var responseObject = JSON.parse(this.responseText);

                        // JSON targeting struc: results, index #, geometry, location, lat/long
                        var lati = responseObject['results'][0]['geometry']['location']['lat'];
                        var long = responseObject['results'][0]['geometry']['location']['lng'];

                        // Retrive the lat & long of film location
                        var myLatLng = { lat: lati, lng: long };

                        // Produce Marker on Map
                        console.log(myMap);

                        // Finally Allows Marker on Map!
                        var marker = new google.maps.Marker({
                            position: myLatLng,
                            map: myMap,
                            title: location
                        });

                        // Produce Pin Test
                        console.log(this.responseText);
                        
                        // add to end
                        markers.push(marker);
                    }
                }

                // Implement Request & Response
                subxmlhttp.open("GET", subURL, true);
                subxmlhttp.send();
            }

            // Prints out on webpage
            filmOutput += '</ul>';
            document.getElementById('print-out').innerHTML = filmOutput;
            console.log(filmOutput);
        }
    };

    // Implement Request & Response
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

// List of Unique Films is Stored
function getFilms() {

    // Retrive data from server
    var xmlhttp = new XMLHttpRequest();
    var url = "find.data?filmList";
    console.log(url);
    xmlhttp.onreadystatechange = function () {

        // Check status of XMLHttpRequest
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText)['data'];
            console.log(myArr);

            // stored in films
            films = myArr;
        }
    };

    // Implement Request & Response
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

// Autofiller
function autoFill(name){
    document.getElementById('filmTitle').value = name;
}

// Function call
getFilms();

// Track user input box typing to fulfill autocomplete
document.getElementById('filmTitle').onkeyup = function(e) {
    // Test Event e
    console.log(e);

    // Get contents of film title input
    let input = document.getElementById('filmTitle').value.toLowerCase();
    console.log(input);

    // Get matches
    document.getElementById('matches').innerHTML = '';

    // Loop through all existing stored film titles for match
    for(let i = 0; i < films.length; i++){

        // checks input even at lowercasing
        if (films[i].toLowerCase().includes(input)){
            
            // Getting name of film, place into autofill onclick event, need to improve way var are inputted into string
            document.getElementById('matches').innerHTML += "<span onclick='autoFill(\"" + films[i] +"\");'>" + films[i] + "</span><br>";
        }
    }
};