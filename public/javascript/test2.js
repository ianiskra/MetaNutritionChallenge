// Color Signals
var BLACK = '#000000';
var GREEN = '#00FF00';
var RED = '#FF0000';
var timerHandle;
var minutes = 0;
var seconds = 0;
var hundredths = 0;

/* Do Not USE these campus locations for Test Cases:
  1. Bookstore
  2. Bayramian Hall
  3. Jacaranda Hall
  4. Manzanita Hall
  5. Citrus Hall
*/

// Botanical Gardens location
var botanicGardens = {
    north: 34.2393,
    west: -118.5280,
    south: 34.2387,
    east: -118.5256
};

// Oviatt Library location
var library = {
    north: 34.2404,
    west: -118.5300,
    south: 34.2395,
    east: -118.5285
};

// Sierra Hall Location
var sierraHall = {
    north: 34.2384,
    west: -118.5314,
    south: 34.2380,
    east: -118.5300
};

// Orange Grove Location
var orangeGrove = {
    north: 34.2373,
    west: -118.5273,
    south: 34.2356,
    east: -118.5247
}

// Student Recreation Center
var src = {
    north: 34.2409,
    west: -118.5253,
    south: 34.2391,
    east: -118.5247
}

// Lot G3
var g3 = {
    north: 34.2389,
    west: -118.5245,
    south: 34.2374,
    east: -118.5233
}

// Lot B1
var b1 = {
    north: 34.2364,
    west: -118.5338,
    south: 34.2356,
    east: -118.5318
}

// Lot B2
var b2 = {
    north: 34.2373,
    west: -118.5338,
    south: 34.2365,
    east: -118.5318
}

// Lot B3
var b3 = {
    north: 34.2386,
    west: -118.5337,
    south: 34.2375,
    east: -118.5328
}

// CSUN Police
var police = {
    north: 34.2389,
    west: -118.5336,
    south: 34.2386,
    east: -118.5328
}

var testQuestions = ["Where is Botanical Gardens?",
    "Where is the Oviatt Library?", "Where is Sierra Hall?", "Where is Orange Grove?",
    "Where is the Student Recreation Center?", "Where is Lot G3?", "Where is Lot B1?",
    "Where is Lot B2?", "Where is Lot B3?", "Where is the CSUN Police?"];

var testBounds = [botanicGardens, library, sierraHall, orangeGrove, src, g3, b1, b2, b3, police];
var testNumber = 0;
var numCorrect = 0;
var rectangles = [];

function getLat(event) {
    return event.latLng.lat();
}
function getLng(event) {
    return event.latLng.lng();
}

function restartGame() {
    // put question[0] into the question box
    document.getElementById('question-area').innerHTML = testQuestions[0] + "<br><br>";
    clearInterval(timerHandle);
    minutes = 0;
    seconds = 0;
    hundredths = 0;
    timerHandle = 0;
    testNumber = 0;
    document.getElementById('restartButton').style.display = "none";
    console.log(rectangles);
    for (var i = 0; i < rectangles.length; i++) {
        console.log(rectangles[i]);
        rectangles[i].setVisible(false);

    }
}

// Initialize and add the map
function initMap() {

    // The location of CSUN 34.2410° N, 118.5277° W
    var csun = { lat: 34.2410, lng: -118.5277 };

    // The map, centered at CSUN
    var map = new google.maps.Map(
        document.getElementById('map'),
        { zoom: 16, center: csun, gestureHandling: 'none', zoomControl: false, streetViewControl: false, fullscreenControl: false });

    // Disable double click
    map.setOptions({ disableDoubleClickZoom: true });

    // Disables pop menus of landmarks
    map.setOptions({ clickableIcons: false });

    // Disables Satelite vs Map
    map.setOptions({ disableDefaultUI: true });

    // Disable poi
    var hideFeatures = [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        },
        {
            featureType: "road",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }
    ];
    map.setOptions({ styles: hideFeatures });


    // Event listner for lat & long (for buliding the test)
    google.maps.event.addListener(map, "click", function (e) {
        //lat and lng is available in e object
        var latLng = e.latLng;

        console.log(": " + getLat(e).toFixed(4));
        console.log(": " + getLng(e).toFixed(4));
    });


    // user double clicks (makes a guess)
    google.maps.event.addListener(map, 'dblclick', function (event) {

        // if testNumber is equal to zero, then:
        if (testNumber == 0) {

            // setInterval for timer function
            timerHandle = setInterval(timer, 10);
            document.getElementById('restartButton').style.display = "block";
        }

        if (testNumber < testQuestions.length) {

            // determine if user guessed correctly or incorrectly
            var fillColor = BLACK;

            // if getLat(event) is between testBounds[testNumber].north .south, getLon(event) .east .west
            if (getLat(event) < testBounds[testNumber].north && getLat(event) > testBounds[testNumber].south &&
                getLng(event) < testBounds[testNumber].east && getLng(event) > testBounds[testNumber].west) {
                // then that's correct
                fillColor = GREEN;
                numCorrect++;
                console.log(numCorrect);
                document.getElementById('question-area').innerHTML += "<span class='green_text'>YES</span>" + "<br><br>";
            }

            // it's wrong
            else {
                fillColor = RED;
                console.log(numCorrect);
                document.getElementById('question-area').innerHTML += "<span class='red_text'>NO</span>" + "<br><br>";
            }

            console.log(testBounds[testNumber].north);

            // reveal the correct location
            var rectangle = new google.maps.Rectangle({
                strokeColor: fillColor,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: fillColor,
                fillOpacity: 0.35,
                map: map,
                bounds: testBounds[testNumber]
            });
            rectangles.push(rectangle);

            // advance to the next test number
            testNumber += 1;

            if (testNumber < testQuestions.length) {
                // display question to user if there are questions left, OR display game over report
                document.getElementById('question-area').innerHTML += testQuestions[testNumber] + "<br><br>";
                // put question[testNumber] into the quesiton box
            }
            else {
                // summarize score/etc
                document.getElementById('question-area').innerHTML += "GAME OVER!";
                document.getElementById('question-area').innerHTML += " Score: " + "<br>" + numCorrect + " Correct "
                    + "<br>" + (testNumber - numCorrect) + " Incorrect.";
                clearInterval(timerHandle);
            }
        }

    }); // end event listener


    // Test the Users Knowledge
    restartGame();
} //end init

// Add leading zero to numbers 9 or below (purely for aesthetics):
function addZeros(num) {

    // Check if num < 10
    if (num < 10) {

        // 0 appended before 10
        num = "0" + num;
    }

    return "" + num;
}

// Extra Credit: Create A Timer
function timer() {

    // Only begins upon first double click
    hundredths += 1;

    // Check if hundredths >= 100
    // check if hundredths > 99
    if (hundredths > 99) {
        hundredths = hundredths - 100;
        seconds = seconds + 1;
    }

    // When secs approaches 60
    if (seconds > 60) {
        // Reduce mins by 60
        seconds = seconds - 60;

        // Bring mins up by 1
        minutes = minutes + 1;
    }

    document.getElementById('timer').innerHTML = addZeros(minutes) + ":" + addZeros(seconds) + ":" + addZeros(hundredths);

    // add 50 (or however long refresh rate is) to milliseconds & fix seconds/minutes accordingly

}

/*
      console.log(rectangle);
*/