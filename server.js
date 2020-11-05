const fs = require('fs');

var state = {
  test:"",
  chapter: 0,
  section: '1.1',
  card: 0,
  rotation: 0,
  data: [],
};

var menu = JSON.parse(fs.readFileSync('public/assets/menu.json'));
var chapters = new Array();
chapters[0] = JSON.parse(fs.readFileSync('public/assets/1-networking-concepts.json'));
chapters[1] = JSON.parse(fs.readFileSync('public/assets/2-infrastructure.json'));
chapters[2] = JSON.parse(fs.readFileSync('public/assets/3-network-operations.json'));
chapters[3] = JSON.parse(fs.readFileSync('public/assets/4-network-security.json'));
chapters[4] = JSON.parse(fs.readFileSync('public/assets/5-network-troubleshooting-and-tools.json'));
// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connect', function (socket) {
  state.data = chapters[state.chapter];
  console.log('We have a new client: ' + socket.id);
  console.log('Client ' + socket.id + ' has connected');

  io.emit('state', state);

  socket.on('edit', function (data) {
    state = data;
    socket.broadcast.emit('edit', state);
    // This is a way to send to everyone including sender
    fs.writeFile('edited.json', JSON.stringify(state.data), (err) => {
      if (err) {
        throw err;
      }
      console.log("JSON data is saved.");
    });
  });

  // When this user emits, client side: socket.emit('otherevent',some data);
  socket.on('delta', function (data) {
    state = data;
    socket.broadcast.emit('delta', state);
    // This is a way to send to everyone including sender
  });

  socket.on('disconnect', function () {
    console.log('Client ' + socket.id + ' has disconnected');
  });

});


app.get('/menu', (request, response) => {
  response.send(menu);
});