/* Objective: Create a service that shows on a map where movies have been filmed in San Francisco. 
 * The user should be able to filter the view using autocompletion search. The data is available 
 * on the Film_Locations_in_San_Francisco.csv
 * 
 * Maps JavaScript Reference: https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.zoom
 * Autocomplete for Addresses and Search Terms: https://developers.google.com/maps/documentation/javascript/places-autocomplete
 * Geoservices: https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com?q=geocoding&id=42fea2de-420b-4bd7-bd89-225be3b8b7b0&project=meta-nutrition-challenge&folder&organizationId
 * 
*/

// Global variables 
let films = [];
let myMap;

// 1. Create JSON variables holding key-pair values on Locations
    // Utilize Values titles and locations from the .csv file
    // Will need to invoke the csv-parser, convert CSV into JSON 

    // Process strings of text
    // let items = data.split("");

    
// API Callback Function
function initMap() {

    // SF: 37.7749° N, 122.4194° W
    var sanFran = { lat: 37.7600, lng: -122.4194 };

    // Map centered at SF
    myMap = new google.maps.Map(
        
        // 4. Use zoom property so map is centered at SF
        document.getElementById('map'),
        { zoom: 13, center: sanFran});

        // 

}

// Perfomrs Search Requests of Movie Locations
function doSearch() {
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

                // Put Pin on Map at Location
                var subURL = 'https://maps.googleapis.com/maps/api/geocode/json?address='+encodeURIComponent(location)+',+San+Francisco,+CA,+94108&key=AIzaSyADDvb3DJSN8Zvdf-XZQ_-HiT8YzlSY6Lc';
                console.log(subURL);
                var subxmlhttp = new XMLHttpRequest();

                // API Location Lat & Long Lookup
                subxmlhttp.onreadystatechange = function() {

                    if(this.readyState == 4 && this.status == 200) {
                        var responseObject = JSON.parse(this.responseText);
                        var lat = responseObject['results'][0]['geometry']['location']['lat'];
                        var lng = responseObject['results'][0]['geometry']['location']['lng'];

                        var myLatLng = { lat: lat, lng: lng };

                        // Produce Marker
                        console.log(myMap);
                        var marker = new google.maps.Marker({
                            position: myLatLng,
                            map: myMap,
                            title: location
                        });


                        // Produce Pin
                        console.log(this.responseText);

                        
                    }
                }

                subxmlhttp.open("GET", subURL, true);
                subxmlhttp.send();
            }

            // Prints out on webpage
            filmOutput += '</ul>';
            document.getElementById('print-out').innerHTML = filmOutput;
            console.log(filmOutput);
        }
    };
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
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

// Function call
getFilms();

// Track the input box typing
document.getElementById('filmTitle').onkeyup = function(e) {
    // Test Event e
    console.log(e);
};

/*
autocomplete 
*/