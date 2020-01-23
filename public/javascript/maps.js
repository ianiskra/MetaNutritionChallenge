let films = [];
/* Objective: Create a service that shows on a map where movies have been filmed in San Francisco. 
 * The user should be able to filter the view using autocompletion search. The data is available 
 * on the Film_Locations_in_San_Francisco.csv
 * 
 * Maps JavaScript Reference: https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.zoom
 * Autocomplete for Addresses and Search Terms: https://developers.google.com/maps/documentation/javascript/places-autocomplete
 * Geoservices: https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com?q=geocoding&id=42fea2de-420b-4bd7-bd89-225be3b8b7b0&project=meta-nutrition-challenge&folder&organizationId
 * 
*/



// 1. Create JSON variables holding key-pair values on Locations
    // Utilize Values titles and locations from the .csv file
    // Will need to invoke the csv-parser, convert CSV into JSON 

    // Process strings of text
    // let items = data.split("");

// 2. Variable Array to contain the JSON variables of film & location

// 3. Setup location of San Fransisco
    
// API Callback Function
function initMap() {

    // SF: 37.7749° N, 122.4194° W
    var sanFran = { lat: 37.7600, lng: -122.4194 };

    // Map centered at SF
    var map = new google.maps.Map(
        
        // 4. Use zoom property so map is centered at SF
        document.getElementById('map'),
        { zoom: 13, center: sanFran});

}

function doSearch() {
    let search = document.getElementById('filmTitle').value;
    console.log(search);

    var xmlhttp = new XMLHttpRequest();
    var url = "find.data?filmTitle=" + search;
    console.log(url);    
    xmlhttp.onreadystatechange = function() {
    
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText)['data'];
            console.log(myArr);

            let filmOutput = '<ul>';
            
            for(let i = 0; i < myArr.length; i++){
                let location = myArr[i];
                console.log(location);

                filmOutput += '<li>' + location + '</li>';

                // Put Pin on Map at Location
                
            }

            filmOutput += '</ul>';
            document.getElementById('added-feat').innerHTML = filmOutput;
            console.log(filmOutput);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

// Autocomplete
function getFilms() {
    

    var xmlhttp = new XMLHttpRequest();
    var url = "find.data?filmList";
    console.log(url);
    xmlhttp.onreadystatechange = function () {

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

// FUnction call
getFilms();