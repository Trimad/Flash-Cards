
var test, chapter, section;

function buildMenu(json) {
  console.log(json);
  let menu = document.getElementById("menu");
  let menuBUTTON = document.createElement("BUTTON");
  menuBUTTON.className = "collapsible l1"; //1. collapsible button
  menuBUTTON.innerHTML = "Menu";
  let menuDIV = document.createElement("DIV");//2. content DIV
  menuDIV.className = "content";
  menu.appendChild(menuBUTTON);
  menu.appendChild(menuDIV);

  for (j of json) {
    let tBUTTON = document.createElement("BUTTON");//1. collapsible button
    tBUTTON.className = "collapsible l2";
    tBUTTON.innerHTML = j.name;
    tBUTTON.onclick = function () {
      test = this.innerHTML;
    }
    let tDIV = document.createElement("DIV");//2. content DIV
    tDIV.className = "content";

    for (c of j.chapter) {
      let cBUTTON = document.createElement("BUTTON");//1. collapsible button
      cBUTTON.className = "collapsible l3";
      cBUTTON.innerHTML = c.name;
      cBUTTON.onclick = function () {
        chapter = this.innerHTML;
      }
      let cDIV = document.createElement("DIV");//2. content DIV
      cDIV.className = "content";

      for (s of c.section) {
        let sBUTTON = document.createElement("BUTTON");
        sBUTTON.className = "noncollapsible l4";
        sBUTTON.innerHTML = s.name;
        sBUTTON.onclick = function () {
          section = this.innerHTML;
          changeDeck(test, chapter, section);

        }

        let sDIV = document.createElement("DIV");
        sDIV.className = "content";

        cDIV.appendChild(sBUTTON);
        cDIV.appendChild(sDIV);
      }
      tDIV.appendChild(cBUTTON);
      tDIV.appendChild(cDIV);
    }
    menuDIV.appendChild(tBUTTON);
    menuDIV.appendChild(tDIV);

  }

}

function changeDeck(test, chapter, section) {
  console.log(test, chapter, section);
}

function addListeners() {
  let collapsibles = document.getElementsByClassName("collapsible");
  let noncollapsibles = document.getElementsByClassName("noncollapsible");

  for (c of collapsibles) {
    c.addEventListener("click", function () {
      this.classList.toggle("active");
      let content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        let sum = sumScrollHeights(this, 0);
        content.style.maxHeight = sum + "px";
      }
    });
  }

  for (n of noncollapsibles) {

    n.addEventListener("click", function () {

      for (n of noncollapsibles) {
        n.classList.remove("viewing");
      }

      this.classList.toggle("viewing");
    });
  }

  function sumScrollHeights(content, _sum) {

    let sum = _sum;

    if (content.parentElement) {
      [...content.parentElement.children].forEach(function (child) {
        sum += child.scrollHeight;
      });
      sum += content.scrollHeight;
      sum += sumScrollHeights(content.parentElement, sum);
    }

    return sum;
  }
}
