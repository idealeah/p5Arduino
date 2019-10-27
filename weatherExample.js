let serial;
let string;
let cities = ["London", "Nairobi", "Minneapolis", " Tokyo", "New York"];
let buttonIsPressed = false;
let locationState = 0;
let dataIn = [];
let firstContact = false; // Whether we've heard from the microcontroller

//set milliseconds to wait before allowing a new button action
let wait = 800;
let time;

let hue = 100;
let ledValue;

function setup() {
  createCanvas(500, 500);
  colorMode(HSB);
  getWeather(locationState);

  background(hue, 100, 100);

  //initialize timing
  time = millis();

  // Instantiate our SerialPort object
  serial = new p5.SerialPort();

  // Let's list the ports available
  let portlist = serial.list();

  // Assuming our Arduino is connected, let's open the connection to it
  // Change this to the name of your arduino's serial port
  serial.open("COM5");

  // Register some callbacks

  // When we connect to the underlying server
  serial.on('connected', serverConnected);

  // When we get a list of serial ports that are available
  serial.on('list', gotList);

  // When we some data from the serial port
  serial.on('data', gotData);

  // When or if we get an error
  serial.on('error', gotError);

  // When our serial port is opened and ready for read/write
  serial.on('open', gotOpen);
}


// There is data available to work with from the serial port
function gotData() {
  let currentString = serial.readStringUntil("\n");

  //trim off white space
  let str = currentString.trim();
  console.log(str);

  // if this is the first byte received, and it's an A, clear the serial
  // buffer and note that you've had first contact from the microcontroller.
  // Otherwise, add the incoming byte to the array:
  if (firstContact == false) {
    if (str == "A") {
      console.log(currentString);
      serial.clear(); // clear the serial port buffer
      firstContact = true; // you've had first contact from the microcontroller
      serial.write("A"); // ask for more
    }
  } else {

    if (currentString !== "") {
      dataIn.push(currentString);
    }

    if (dataIn.length == 3) {
      //lets see our data
      console.log(dataIn);

      hue = map(dataIn[1], 600, 1000, 0, 100);

      //listen for button to be pressed
      //test whether we've waited long enough
      console.log(cities.length - 1);
      if (dataIn[0] == 1 && millis() - time > wait) {

        //go to the next city
        locationState++

        //reset the location state value
        if (locationState > cities.length - 1) {
          locationState = 0;
        }

        //get the weather
        getWeather(locationState);

        //record the time when the button was last pressed
        time = millis();
      }

      //clear the data 
      serial.clear();
      dataIn = [];

      serial.write(LEDvalue);
    }
  }
}

function draw() {
  background(hue, 100, 100);
  fill(255);
  textSize(30);
  text(cities[locationState], 200, 200);
}

//function that happens when a button is pushed
function getWeather(i) {
  //all our string elements
  let mainUrl = "http://api.openweathermap.org/data/2.5/weather?"
  //the city name variable
  let city = "q=" + cities[i];
  let units = "&units=imperial"
  let key = "&APPID=1b067cf07d577b3a8c9b080d1b786ffb";

  //add our string together
  let url = mainUrl + city + units + key;
  //load JSON file
  loadJSON(url, parseWeather);
}

function parseWeather(weather) {
  weatherData = weather;
  console.log(weatherData);

  //set a background hue
  LEDvalue = floor(map(weather.main.temp, 0, 100, 0, 255));
}


// Methods available
// serial.read() returns a single byte of data (first in the buffer)
// serial.readChar() returns a single char 'A', 'a'
// serial.readBytes() returns all of the data available as an array of bytes
// serial.readBytesUntil('\n') returns all of the data available until a '\n' (line break) is encountered
// serial.readString() retunrs all of the data available as a string
// serial.readStringUntil('\n') returns all of the data available as a string until a (line break) is encountered
// serial.last() returns the last byte of data from the buffer
// serial.lastChar() returns the last byte of data from the buffer as a char
// serial.clear() clears the underlying serial buffer
// serial.available() returns the number of bytes available in the buffer
// serial.write(somevar) writes out the value of somevar to the serial device

// We are connected and ready to go
function serverConnected() {
  print("We are connected!");
}

// Got the list of ports
function gotList(thelist) {
  // theList is an array of their names
  for (let i = 0; i < thelist.length; i++) {
    // Display in the console
    print(i + " " + thelist[i]);
  }
}

// Connected to our serial device
function gotOpen() {
  print("Serial Port is open!");
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  print(theerror);
}