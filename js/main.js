"use strict";

let imagesConfig = {
  path: "images",
  extension: ".jpg"
}

let images = ["leon", "elefante", "vaca"];
let imagesCopy = [...images];
let imagesFilled = [];
let imagesSelected = [];
let cellsPositionsClicked = [];

const board = new Board();
board.create(2, 3);

let cells = document.querySelectorAll(".grid-animals__cell");
cells.forEach(cell => {
  cell.classList.add("grid-animals__cell--hover");
  let randomImagePosition = Math.floor(Math.random() * imagesCopy.length);
  let imageName = imagesCopy[randomImagePosition];

  imagesFilled.push(imageName);
  deleteRepeatedAnimal(imageName);
});

function deleteRepeatedAnimal(imageName) {
  let numberOfCurrentAnimalsOnBoard = imagesFilled.filter(animalName => animalName === imageName).length;
  if (numberOfCurrentAnimalsOnBoard === 2) {
    imagesCopy = imagesCopy.filter(image => image !== imageName);
  }

  return imagesCopy;
}

let lockBoard = false;
cells.forEach(cell => cell.addEventListener("click", flipCard));

function flipCard(event) {
  if(lockBoard) {
    return;
  }
  let currentCell = event.currentTarget;
  let cells = [...currentCell.parentElement.parentElement.children]
              .map(row => [...row.children])
              .flat();
  let cellPositionClicked = [...cells].indexOf(currentCell);
  cellsPositionsClicked.push(cellPositionClicked);

  // Controla que al seleccionar la segunda imagen de la pareja, no lo cuente como tal hasta que no se seleccione otra celda distinta a la primera imagen.
  if (isNotClickedInSameCell()) {
    let thisAnimal = imagesFilled[cellPositionClicked];
    currentCell.innerHTML = `<img src='${ imagesConfig.path }/${ thisAnimal }${ imagesConfig.extension }'/>`;
    
    if (currentCell.children[0].style.display !== "block") {
      currentCell.children[0].style.display = "block";
      imagesSelected.push(currentCell);
      currentCell.classList.remove("grid-animals__cell--hover");
      if (isCoupleSelected()) {
        lockBoard = true;
        cellsPositionsClicked = [];
        if (imagesSelectedAreNotEquals()) {
          setTimeout(() => {
            hideFailSelectedCouple(imagesSelected);
            imagesSelected = [];
            lockBoard = false;
          }, 1200);
        }
        else {
          // Evitamos que se puedan seleccionar parejas ya desveladas previamente.
          imagesSelected.forEach(image => image.removeEventListener("click", flipCard));

          imagesSelected = [];
          cellsPositionsClicked = [];
          lockBoard = false;
        }
      }
    }
  }
  else {
    cellsPositionsClicked.pop();
  }
  
  checkIfGameFinished(cells);
}

function isNotClickedInSameCell() {
  return cellsPositionsClicked[0] !== cellsPositionsClicked[1];
}

function isCoupleSelected() {
  return imagesSelected.length === 2;
}

function imagesSelectedAreNotEquals() {
  return imagesSelected[0].children[0].src !== imagesSelected[1].children[0].src;
}

function hideFailSelectedCouple(imagesSelected) {
  imagesSelected[0].innerHTML = "";
  imagesSelected[0].classList.add("grid-animals__cell--hover");
  imagesSelected[1].innerHTML = "";
  imagesSelected[1].classList.add("grid-animals__cell--hover");
}

function checkIfGameFinished(cells) {
  let cellsArray = [...cells];
  
  let numberOfImagesDisplay = cellsArray.filter(cell => {
    if (cell.children.length > 0) {
      return cell.children[0].style.display === "block";
    }
  }).length;

  if (numberOfImagesDisplay === cellsArray.length) {
    createElementGameFinishedText();
    return true;
  }
}

function createElementGameFinishedText() {
  let memoryGameWrapperDiv = document.querySelector(".memory-game-wrapper");
  let newH2Element = document.createElement("h2");
  newH2Element.textContent = "¡Juego finalizado!";
  memoryGameWrapperDiv.appendChild(newH2Element);
}
