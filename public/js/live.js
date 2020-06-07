//socket.io cursor sharing

//SocketIO client
const socket = io('');

//Respond to various events
socket.on('connect', function () {
    console.log('socket.io connect');
});

socket.on('event', function (data) {
    console.log('socket.io event');
    console.log(data);
});

socket.on('disconnect', function () {
    console.log('socket.io disconnect');
});

socket.on('broadcast', function (data) {
    console.log('broadcast', data);
})

//On welcome, draw all saved cursor positions if given
socket.on('welcome', function (data) {
    console.log('welcome', data);
    if (data.cursorPositionsSaved) {
        console.log('Drawing saved positions');
        console.log(data.cursorPositionsSaved);
        for (let key in data.cursorPositionsSaved) {
            console.log('Saved ID: ' + key);
            moveCursorToPosition(data.cursorPositionsSaved[key]);
        }
    }
})

socket.on('disconnect', function (data) {
    console.log('disconnect', data);
})

//If a mouse move from socket.io is received, draw it
socket.on('mousemove', function (data) {
    console.log('mousemove received', data);
    moveCursorToPosition(data);
})

function moveCursorToPosition(data) {
    //Create a div, if it doesn't already exist for this
    if (!document.getElementById('mousePosition-' + data.id)) {
        var element = document.createElement('div');
        //Set ID, class and style (color based on hash of string)
        element.setAttribute('id', 'mousePosition-' + data.id);
        element.setAttribute('class', 'mousePosition');
        element.style.backgroundColor = '#' + intToRGB(hashCode(data.id));
        //Add to document
        document.getElementsByTagName("body")[0].appendChild(element);
    }

    //Move into position
    element = document.getElementById('mousePosition-' + data.id);
    element.style.left = data.x + 'px';
    element.style.top = data.y + 'px';
}

//On mouse movement, using throttling, send mouse position via socket.io
document.getElementsByTagName("BODY")[0].addEventListener("mousemove", handleMouseMove);
var sendMousePosition_throttled = _.throttle(sendMousePosition, 250);

function handleMouseMove(event) {
    sendMousePosition_throttled(event);
}

function sendMousePosition(event) {
    console.log('sendMousePosition');

    socket.emit('mousemove', {
        x: event.clientX,
        y: event.clientY,
        x_pct: ((event.layerX / event.view.screen.width) * 100).toFixed(3),
        y_pct: ((event.layerY / event.view.screen.height) * 100).toFixed(3)
    });
}



//Helper functions for setting a color from a string
function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function intToRGB(i) {
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
}