var ws = require('nodejs-websocket');
var events = require("events");

// Create a server for the client to receive the data from
var server = ws.createServer(receiveConnection).listen(8001);

function receiveConnection(connection) {
    console.log("New connection");
    connection.on("close", function(message) {
        console.log("Connection closed", message);
    });
    connection.on("error", function(error) {
        console.log("Connection error", error);
    });
    connection.on("text", moveDrone);
    connection.sendText("Hi!");
}

var sending = false;
exports.sendFrame = function(png) {
    // Only send if not sending a message already
    // Improves responsiveness
    if (!sending) {
        sending = true;
        server.connections.forEach(function(conn) {
            conn.sendBinary(png);
        });
        // Wait a little before sending the next frame
        setTimeout(function(){ sending = false}, 400);
    }
    else {
        // console.log("Already sending, dropping frame")
    }
}

var instructionListener = new events.EventEmitter();

function moveDrone(message) {
    var move = JSON.parse(message);
	instructionListener.emit("move", move);
}

exports.instructionListener = instructionListener;