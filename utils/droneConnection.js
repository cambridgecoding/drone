var droneConnection = (function() {

    var my = {};

    var droneAddress = "ws://127.0.0.1:8001/";
    var websocket;
    var tracker;
    var updatingElement;

    function droneWebSocket(url) {
        websocket = new WebSocket(url);
        websocket.onopen = onOpen;
        websocket.onclose = onClose;
        websocket.onerror = onError;
        websocket.onmessage = onMessage;
    }


    function onOpen() {
        console.log("Connection open!");
    }

    function onClose() {
        console.log("Connection closed");
    }

    function onError() {
        console.log("Connection error:");
    }

    function onMessage(message) {
        console.log(message);

        // Received a new snapshot form the drone camera
        if (message.data instanceof Blob) {
            // console.log("received message");
            TrackerUtils.loadImage(message.data, updatingElement);
            tracking.track(updatingElement, tracker);
        }
    }

    my.streamImage = function(colorTracker, element) {
        droneWebSocket(droneAddress);
        tracker = colorTracker;
        updatingElement = element;
    }

    my.send = function(move) {
        websocket.send(JSON.stringify(move))
    }

    return my;

}());
