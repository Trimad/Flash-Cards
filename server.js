const fs = require('fs');

var state = {
  test: 2,
  chapter: 0,
  section: "1.1",
  card: 0,
  rotation: 0,
  data: [],
  color: ""
};

var menu = JSON.parse(fs.readFileSync('public/assets/menu.json'));

var tests = new Array();
tests[0] = [];
tests[1] = [];
tests[2] = [];

//Network+
tests[2][0] = JSON.parse(fs.readFileSync('public/assets/Network+/1-networking-concepts.json'));
tests[2][1] = JSON.parse(fs.readFileSync('public/assets/Network+/2-infrastructure.json'));
tests[2][2] = JSON.parse(fs.readFileSync('public/assets/Network+/3-network-operations.json'));
tests[2][3] = JSON.parse(fs.readFileSync('public/assets/Network+/4-network-security.json'));
tests[2][4] = JSON.parse(fs.readFileSync('public/assets/Network+/5-network-troubleshooting-and-tools.json'));

// var tests = new Array();
// tests[0] = JSON.parse(fs.readFileSync('public/assets/network-plus.json'));
// console.log(tests[0]);

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
  //state.data = chapters[state.chapter]["1.1"];
  console.log(state.test, state.chapter, state.section);
  state.data = tests[state.test][state.chapter][state.section];

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
  socket.on('delta', function (x) {
    state = x;
    console.log(state);
    state.data = tests[state.test][state.chapter][state.section];

    // state.color = menu[state.chapter].chapter[state.chapter].color;
    // console.log(state.color);
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

app.get('/tests', (request, response) => {
  response.send(tests);
});