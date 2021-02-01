"use strict";

class Board {
  constructor() {
    const instance = this.constructor.instance;
    if (instance) {
      return instance;
    }
    this.constructor.instance = this;
  }

  create(numRows, numCells) {
    let gridAnimalsDiv = document.querySelector(".grid-animals");

    for (let i = 0; i < numRows; i++) {
      let row = this.createRow(gridAnimalsDiv);
      for (let j = 0; j < numCells; j++) {
        let cell = this.createCell(gridAnimalsDiv);
        cell.classList.add("grid-animals__cell--hover");
        row.appendChild(cell);
      }
    }

    this.showGoBackMenuButton();
  }

  createRow(gridAnimalsDiv) {
    let gridAnimalsRowDiv = document.createElement("div");
    let gridAnimalsRowClassDiv = document.createAttribute("class");
    gridAnimalsRowClassDiv.value = "grid-animals__row";
    gridAnimalsRowDiv.setAttributeNode(gridAnimalsRowClassDiv);
    gridAnimalsDiv.appendChild(gridAnimalsRowDiv);

    return gridAnimalsRowDiv;
  }

  createCell(gridAnimalsDiv) {
    let gridAnimalsCellDiv = document.createElement("div");
    let gridAnimalsCellClassDiv = document.createAttribute("class");
    gridAnimalsCellClassDiv.value = "grid-animals__cell";
    gridAnimalsCellDiv.setAttributeNode(gridAnimalsCellClassDiv);
    gridAnimalsDiv.appendChild(gridAnimalsCellDiv);

    return gridAnimalsCellDiv;
  }

  shuffleImages(animals) {
    let temp = 0;

    for (let i = animals.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      temp = animals[i];
      animals[i] = animals[j];
      animals[j] = temp;
    }
    return animals;
  }

  isNotClickedInSameCell() {
    return cellsPositionsClicked[0] !== cellsPositionsClicked[1];
  }

  isCoupleSelected() {
    return imagesSelected.length === 2;
  }

  imagesSelectedAreNotEquals() {
    return imagesSelected[0].children[0].src !== imagesSelected[1].children[0].src;
  }

  hideFailSelectedCouple(imagesSelected) {
    imagesSelected[0].innerHTML = "";
    imagesSelected[0].classList.add("grid-animals__cell--hover");
    imagesSelected[1].innerHTML = "";
    imagesSelected[1].classList.add("grid-animals__cell--hover");
  }

  checkIfGameFinished(cells) {
    let cellsArray = [...cells];
    
    let numberOfImagesDisplay = cellsArray.filter(cell => {
      if (cell.children.length > 0) {
        return cell.children[0].style.display === "block";
      }
    }).length;
  
    if (numberOfImagesDisplay === cellsArray.length) {
      this.showGameFinished();
      return true;
    }
  }

  showGameFinished() {
    const endGameMessage = document.getElementById("end-game-message");
    endGameMessage.style.display = "block";

    showGoBackMenuButton();
  }

  showGoBackMenuButton() {
    const endGameMessage = document.getElementById("end-game-message");
    const menuGame = document.getElementById("menu-game");
    menuGame.style.display = "inline-block";
    menuGame.addEventListener("click", () => {
      const difficultyDiv = document.querySelector(".grid-animals-container__difficulty");
      const gridAnimalsDiv = document.querySelector(".grid-animals");
      const gridAnimalsRowClassDiv = gridAnimalsDiv.children;

      [...gridAnimalsRowClassDiv].forEach(row => row.remove());
      menuGame.style.display = "none";
      difficultyDiv.style.display = "block";
      gridAnimalsDiv.style.display = "none";
      endGameMessage.style.display = "none";
    });
  }
}
