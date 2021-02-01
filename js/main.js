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

const board = new Board();

document.querySelector(".grid-animals-container__difficulty--easy")
  .addEventListener("click", selectGameDifficulty);

document.querySelector(".grid-animals-container__difficulty--medium")
  .addEventListener("click", selectGameDifficulty);

document.querySelector(".grid-animals-container__difficulty--hard")
  .addEventListener("click", selectGameDifficulty);

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

  imagesSelected = [];
  cellsPositionsClicked = [];
  animalsFilled = [...animalsFilled, ...animalsFilled];
  animalsFilled = board.shuffleImages(animalsFilled);

  const difficulty = document.querySelector(".grid-animals-container__difficulty");
  difficulty.style.display = "none";

  const gridAnimalsDiv = document.querySelector(".grid-animals");
  gridAnimalsDiv.style.display = "block";

  cells = document.querySelectorAll(".grid-animals__cell");
  cells.forEach(cell => cell.addEventListener("click", flipCard));
}

function flipCard(event) {
  if(lockBoard) {
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
