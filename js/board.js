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
        row.appendChild(cell);
      }
    }
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

  deleteRepeatedAnimal(imageName) {
    let numberOfCurrentAnimalsOnBoard = imagesFilled.filter(animalName => animalName === imageName).length;
    if (numberOfCurrentAnimalsOnBoard === 2) {
      imagesCopy = imagesCopy.filter(image => image !== imageName);
    }
  
    return imagesCopy;
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
      this.createElementGameFinishedText();
      return true;
    }
  }

  createElementGameFinishedText() {
    let memoryGameWrapperDiv = document.querySelector(".memory-game-wrapper");
    let newH2Element = document.createElement("h2");
    newH2Element.textContent = "¡Juego finalizado!";
    memoryGameWrapperDiv.appendChild(newH2Element);
  }
}
