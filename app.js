
var serialPort = require('serialport');
var SerialPort = serialPort;
var portName = '/dev/ttyAMA0';
var GPS = require('gps');
var gps = new GPS;
var XMLHttpRequest = require('xhr2');

var myPort = new SerialPort(portName, {
    baudRate: 9600,
    parser: new SerialPort.parsers.readline("\r\n")
});

myPort.on('open', onOpen);
myPort.on('data', onData);

function onOpen() {
    console.log("open connection");    
}

function onData(data) {
    var parsedData = GPS.Parse(data);
    var latitude;
    var longitude;
    if (parsedData) {
        var string = parsedData.raw;
        // console.log(data)
        // console.log(parsedData);
        // onsole.log(typeof(string));
         var substring = string.substring(0, 6);
        // console.log(type);
         if (substring === "$GPGGA") {
                console.log(parsedData.lat);
                console.log(parsedData.lon);
                const coords = {
                    name: "new coordinate",
                    latitude: parsedData.lat,
                    longitude: parsedData.lon
                }
                
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = () => {
                    if(this.readyState == 4 && this.status == 200) {
                        console.log(this.responseText);
                    }
                }
                var stringifiedData = JSON.stringify(coords);
                xhttp.open("POST", "http://localhost:3000/setLocation", true);
                xhttp.setRequestHeader("Content-type","application/json");
                xhttp.send(stringifiedData);
                
                  
                setTimeout(function(){
                    console.log("waiting")}, 3000);
          }
      } 
} 