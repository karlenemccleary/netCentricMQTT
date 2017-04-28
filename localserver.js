var express = require('express')
var app = express()
var mqtt = require('mqtt')
var path = require('path');

//mosquitto_pub -t 'zhang/isTheBest' -m 'it is true'
//mosquitto_pub -t 'zhang/time' -m '{"time": "midnight"}'
//mosquitto_pub -t 'zhang/stuff' -m 'Something....something...html'

const file = "people.json";
var jsonString;
var jsonArr = [];
var messageQueue = [];

//var client  = mqtt.connect('mqtt://85.119.83.194')
 var client  = mqtt.connect('mqtt://localhost:1883')
client.on('connect', function () {
 // client.subscribe('presence')
 // client.subscribe('world')
 // client.subscribe('apple')
client.subscribe('zhang/#')
  client.publish('zhang/class', 'Hello mqtt')
  client.publish('zhang/presence', '{"firstName" : "Aiden", "lastName": "Something"}')
  client.publish('zhang/presence', 'What up')
client.publish('zhang/presence', 'What upWhat upWhat upWhat upWhat up')
  client.publish('zhang/world', '{"num1":1, "num2":2}')
 client.publish('zhang/world', 'hi')
client.publish('zhang/rocks', 'I like turtles.')
})
 
client.on('message', function (topic, message) {
   var date = new Date();
        var dd = date.getDate();
        var mm = date.getMonth()+1; //January is 0!

        var yyyy = date.getFullYear();
        if(dd<10){
          dd='0'+dd;
        } 
        if(mm<10){
          mm='0'+mm;
        } 
        var date = mm+'/'+dd+'/'+yyyy;
        var time = new Date();
        var hour = time.getHours();
        var min = time.getMinutes();
        var s = time.getSeconds();
        if(hour<10){
          hour='0'+hour;
        } 
        if(min<10){
          min='0'+min;
        }
        if(s<10){
          s='0'+s;
        }
        var time = hour + ":" + min +":"+ s;
	var dateTime = date + " " + time;
var json = {"payloadString": message.toString(), "destinationName": topic, "dateTime": dateTime};
  messageQueue.push(json);
})

// Function to response with error message
function returnError(code, message, response) {
	response.writeHead(code, {'Content-Type': 'text/html'});
	response.end(message);
}

function getMessage(res) {
	if(messageQueue.length > 0) {
		console.log("sending messages");
		var json = {"arr": messageQueue};
		res.send(json);

	}
}

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/html/table2.html');
})

app.get('/logo', function (req, res) {
  res.sendFile(__dirname + '/jpg/technipfmc.jpg');
})

app.get('/tablecss', function (req, res) {
  res.sendFile(__dirname + '/html/table.css');
})

app.get('/getMessages', function (req, res) {
  getMessage(res);
})

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})
