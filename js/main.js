"use strict";

let imagesConfig = {
  path: "images",
  extension: ".jpg"
}

let images = ["leon", "elefante", "vaca", "leon", "elefante", "vaca"];
let imagesCopy = [...images];
let imagesFilled = [];
let imagesSelected = [];
let cellsPositionsClicked = [];
let lockBoard = false;

const board = new Board();
board.create(2, 3);
imagesFilled = board.shuffleImages(imagesCopy);

let cells = document.querySelectorAll(".grid-animals__cell");
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

  // Controla que no sea posible repetir la selección de la pareja hasta que no se seleccione otra celda distinta a la primera imagen.
  if (board.isNotClickedInSameCell()) {
    let thisAnimal = imagesFilled[cellPositionClicked];
    currentCell.innerHTML = `<img src='${ imagesConfig.path }/${ thisAnimal }${ imagesConfig.extension }'/>`;
    
    if (currentCell.children[0].style.display !== "block") {
      currentCell.children[0].style.display = "block";
      imagesSelected.push(currentCell);
      currentCell.classList.remove("grid-animals__cell--hover");
      if (board.isCoupleSelected()) {
        lockBoard = true;
        cellsPositionsClicked = [];
        if (board.imagesSelectedAreNotEquals()) {
          setTimeout(() => {
            board.hideFailSelectedCouple(imagesSelected);
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
  
  board.checkIfGameFinished(cells);
}
