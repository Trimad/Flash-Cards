var myFont;
var state;

var cardFront, cardBack, cardBackTable, body;
// Keep track of our socket connection
var socket;

function preload() {
  myFont = loadFont('assets/inconsolata.woff');
}


function setup() {
  textFont(myFont);
  noCanvas();
  body = select('body');
  cardFront = select('.flip-card-front');
  cardBack = select('.flip-card-back');
  cardBackTable = select('.answers-table');
  const ip = '192.168.1.3';
  socket = io.connect('http://' + ip + ':3000');

  // socket.on('connect', () => {
  //   console.log("connect");
  //   socket.emit("test", state);
  // });

  socket.on('state', function (data) {
    state = data;
    showCard();
  });

  socket.on('edit', function (data) {
    console.log("edit", data);
  });

  socket.on('delta', function (data) {
    console.log("delta");
    state = data;
    updateStyle();
    updateTransform();
    setTimeout(function () {
      showCard();
    }, 300);
  });
}

//https://www.w3schools.com/jsref/met_document_getelementbyid.asp
function showCard() {
  cardFront.html(state.data[state.section][state.card].Q);

  var table = document.getElementById("answers-table");
  table.innerHTML = "";

  for (let i = 0; i < state.data[state.section][state.card].A.length; i++) {
    const txt = state.data[state.section][state.card].A[i];
    const tr = document.createElement("TR");
    const td = document.createElement("TD");
    const textArea = document.createElement("TEXTAREA");
    textArea.value = txt;
    textArea.addEventListener("change", editCard);
    td.appendChild(textArea);
    tr.appendChild(td);
    table.appendChild(tr);
  }
}

function editCard() {
  var index = this.parentNode.parentNode.rowIndex;
  state.data[state.section][state.card].A[index] = this.value;
  socket.emit('delta', state);
  socket.emit('edit', state);
  //this shit won't work until this function pulls text from the textareas
}

let rotationModifier = 0;
function updateSession() {
  let radioButtons = document.getElementsByName('session');
  if (radioButtons[0].checked) {
    rotationModifier = 0;
  } else {
    rotationModifier = 1;
  }
  updateTransform();
}

function updateTransform() {
  const rx = 'rotateX(' + floor(state.card * 360) + 'deg)';
  const ry =
    'rotateY(' + floor((state.rotation + rotationModifier) * 180) + 'deg)';
  document.getElementById('flipX').style.transform = rx;
  document.getElementById('flipY').style.transform = ry;
}

function updateStyle() {
  switch (state.chapter) {
    case 0:
      cardFront.style('background: black; border: 2px solid #6e298d;');
      cardBack.style('background: black; border: 2px solid #6e298d;');
      body.style('background: #6e298d;');
      break;
    case 1:
      cardFront.style('background: black; border: 2px solid #62a609;');
      cardBack.style('background: black; border: 2px solid #62a609;');
      body.style('background: #62a609;');
      break;
    case 2:
      cardFront.style('background: black; border: 2px solid #f5a81c;');
      cardBack.style('background: black; border: 2px solid #f5a81c;');
      body.style('background: #f5a81c;');
      break;
    case 3:
      cardFront.style('background: black; border: 2px solid #0091b9;');
      cardBack.style('background: black; border: 2px solid #0091b9;');
      body.style('background: #0091b9;');
      break;
    case 4:
      cardFront.style('background: black; border: 2px solid #c1d42e;');
      cardBack.style('background: black; border: 2px solid #c1d42e;');
      body.style('background: #c1d42e;');
      break;
  }
}

function keyPressed() {
  let arrowPressed = false;
  //let deckSize = chapters[state.chapter][state.section].length - 1;
  let deckSize = 100;
  if (keyCode === UP_ARROW && state.card < deckSize) {
    state.card++;
    arrowPressed = true;
    if (state.rotation % 2 === 1) {
      state.rotation--;
    }
  } else if (keyCode === DOWN_ARROW && state.card > 0) {
    state.card--;
    arrowPressed = true;
    if (state.rotation % 2 === 1) {
      state.rotation--;
    }
  } else if (keyCode === LEFT_ARROW) {
    state.rotation--;
    arrowPressed = true;
  } else if (keyCode === RIGHT_ARROW) {
    state.rotation++;
    arrowPressed = true;
  }

  if (arrowPressed) {
    changeCardAndRotation(state.card, state.rotation);
  }

}

function changeChapterAndSection(chapter, section) {
  state.chapter = chapter;
  state.section = section;
  state.card = 0;
  state.rotation = 0;
  updateTransform();
  updateStyle();
  setTimeout(function () {
    showCard();
  }, 300);
  socket.emit('delta', state);
}

function changeCardAndRotation(card, rotation) {
  state.card = card;
  state.rotation = rotation;
  updateTransform();
  setTimeout(function () {
    showCard();
    //saveCard();
  }, 300);
  socket.emit('delta', state);
}