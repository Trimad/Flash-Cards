function setup() {

  fetch("http://localhost:3000/menu")
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      buildMenu(json);
      addListeners();
    });

  noLoop();
  noCanvas();
}
