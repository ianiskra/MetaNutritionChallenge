/* Objective: Create a service that shows on a map where movies have been filmed in San Francisco. 
 * The user should be able to filter the view using autocompletion search. The data is available 
 * on the Film_Locations_in_San_Francisco.csv
 * 
 * Maps JavaScript Reference: https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.zoom
 * Autocomplete for Addresses and Search Terms: https://developers.google.com/maps/documentation/javascript/places-autocomplete
 * 
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
        
    xmlhttp.onreadystatechange = function() {
    
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            console.log(myArr);

            for(let i = 0; i < myArr.length; i++){
                let location = myArr[i];
                console.log(location);

                // Put Pin on Map at Location
                
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}