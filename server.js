var express = require('express')
var app = express()
var mqtt = require('mqtt')
var path = require('path');


const file = "people.json";
var jsonString;
var jsonArr = [];
var messageQueue = [];

var client  = mqtt.connect('mqtt://test.mosquitto.org')
 
client.on('connect', function () {
  client.subscribe('presence')
  client.publish('presence', 'Hello mqtt')
  client.publish('presence', 'Eyyyy')
  client.publish('presence', 'What up')
  client.publish('presence', 'screw you')
})
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString())
  messageQueue.push(message);
  client.end()
})

// Function to response with error message
function returnError(code, message, response) {
	response.writeHead(code, {'Content-Type': 'text/html'});
	response.end(message);;
}


/*
Function to process GET request
-targetFile: file of data
-query: object parsed from query string in URL
-response: response object
*/
function doGET (targetFile, query, response) {

	if(messageQueue.length > 0) {
		console.log("sending message");
		response.end(messageQueue[0].toString() + "HI");
	}
}

function getMessage(res) {
	if(messageQueue.length > 0) {
		console.log("sending message");
		var message = messageQueue[0].toString();
		messageQueue.splice(0, 1);
		res.send(message);

	}
}

/*
Function to process GET request
-targetFile: file of data
-bodyData: a new data set parsed from request body and to be saved into the target file
-response: response object
*/
function doPOST(targetFile, bodyData, response) {

	fs.readFile(targetFile, function(err, data) {
		var newObj = qs.parse(bodyData);
		jsonArr.push(newObj)
		jsonString = JSON.stringify(jsonArr, null, 4);
		console.log(jsonArr)
		fs.writeFile(targetFile, jsonString)
		response.end("Added User" + JSON.stringify(newObj, null, 4));

	});


}


/*
Function to process GET request
-targetFile: file of data
-query: object parsed from query string in URL
-response: response object
*/
function doDELETE(targetFile, query, response) {

	var stringIn;
	fs.readFile(targetFile, function(err, data) {
		var arr = JSON.parse(data);
		var newArr = [];
		var deletedUsers = [];
		console.log(arr)
		for(var index in arr) {
			var json = arr[index]
			if(json.id == query.id) {
				deletedUsers.push(json)
			}
			else if(json.firstName == query.firstName) {
				deletedUsers.push(json)
			}
			else if(json.lastName == query.lastName) {
				deletedUsers.push(json)
			}
			else if(json.major == query.major) {
				deletedUsers.push(json)
			}
			else if(json.email == query.email) {
				deletedUsers.push(json)
			}
			else {
				newArr.push(json)
			}
		}
		fs.writeFile(targetFile, JSON.stringify(newArr, null, 4));
		response.end("Deleted Users:" + JSON.stringify(deletedUsers, null, 4));


	});


	// Implementation
	if(query.id) {
		console.log(query.id)
	}
	else if(query.firstName) {
		console.log(query.firstName)
	}	
	
}


/*
Function to process GET request
-targetFile: file of data
-bodyData: a new data set parsed from request body and to be saved into the target file
-response: response object
*/
function doPUT(targetFile, bodyData, response) {
	// Implementation
}




app.get('/', function (req, res) {
  res.sendFile('P:/Private/Documents/GitHub/netCentricMQTT/html/table2.html');
})

app.get('/logo', function (req, res) {
  res.sendFile('P:/Private/Documents/GitHub/netCentricMQTT/jpg/technipfmc.jpg');
})

app.get('/findUser', function (req, res) {
  getMessage(res);
})

app.listen(8080, function () {
  console.log('Example app listening on port 3000!')
})