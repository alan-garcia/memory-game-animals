"use strict";

const imagesConfig = {
  path: "images",
  extension: ".jpg"
}

const animals = ["leon", "elefante", "vaca", "perro", "mono", "oveja", "buho", "burro", "caballo", "cerdo", "gallo", "gato", "pato", "pavo", "pollito"];
let animalsFilled = [];
let imagesSelected = null;
let cells = null;
let cellsPositionsClicked = null;
let lockBoard = false;
let numberOfMovements = 0;

const board = new Board();
board.setNumberOfMovements(numberOfMovements);

var difficultyList = document.querySelectorAll(".grid-animals-container__difficulty > div");
difficultyList.forEach(difficulty => difficulty.addEventListener("click", selectGameDifficulty));

function selectGameDifficulty(event) {
  let difficultySelected = event.currentTarget.className.split("--")[1];
  if (difficultySelected === "easy") {
    const numRows = 2;
    const numCells = 3;
    let numberOfDistinctAnimalsToShow = (numRows * numCells) / 2;
    board.create(numRows, numCells);
    animalsFilled = animals.slice(0, numberOfDistinctAnimalsToShow);
  }
  else if (difficultySelected === "medium") {
    const numRows = 3;
    const numCells = 4;
    let numberOfDistinctAnimalsToShow = (numRows * numCells) / 2;
    board.create(numRows, numCells);
    animalsFilled = animals.slice(0, numberOfDistinctAnimalsToShow);
  }
  else if (difficultySelected === "hard") {
    const numRows = 5;
    const numCells = 6;
    let numberOfDistinctAnimalsToShow = (numRows * numCells) / 2;
    board.create(numRows, numCells);
    animalsFilled = animals.slice(0, numberOfDistinctAnimalsToShow);
  }

  lockBoard = false;
  numberOfMovements = 0;
  imagesSelected = [];
  cellsPositionsClicked = [];
  animalsFilled = [...animalsFilled, ...animalsFilled];
  animalsFilled = board.shuffleImages(animalsFilled);

  document.querySelector(".movements").style.display = "block";
  document.querySelector(".grid-animals-container__difficulty").style.display = "none";
  document.querySelector(".grid-animals").style.display = "block";

  cells = document.querySelectorAll(".grid-animals__cell");
  cells.forEach(cell => cell.addEventListener("click", flipCard));
}

function flipCard(event) {
  if (lockBoard) {
    return;
  }
  let currentCell = event.currentTarget;
  let cellPositionClicked = [...cells].indexOf(currentCell);
  cellsPositionsClicked.push(cellPositionClicked);

  // Controla que no sea posible repetir la selección de la pareja hasta que no se seleccione otra celda distinta a la primera imagen.
  if (board.isNotClickedInSameCell()) {
    let thisAnimal = animalsFilled[cellPositionClicked];
    currentCell.innerHTML = `<img src='${ imagesConfig.path }/${ thisAnimal }${ imagesConfig.extension }'/>`;
    if (currentCell.children[0].style.display !== "block") {
      currentCell.children[0].style.display = "block";
      currentCell.children[0].classList.add("animate-image-selected");
      imagesSelected.push(currentCell);
      currentCell.classList.remove("grid-animals__cell--hover");
      if (board.isCoupleSelected()) {
        lockBoard = true;
        board.setNumberOfMovements(++numberOfMovements);
        cellsPositionsClicked = [];
        if (board.imagesSelectedAreNotEquals()) {
          window.coupleSelectedTimeOutHandler = setTimeout(() => {
            board.hideFailSelectedCouple(imagesSelected);
            imagesSelected = [];
            lockBoard = false;
          }, 1100);
        }
        else {
          imagesSelected.forEach(image => {
            image.children[0].classList.add("animate-match-couple");

            // Evitamos que se puedan seleccionar parejas ya desveladas previamente.
            image.removeEventListener("click", flipCard);
          }); 
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
