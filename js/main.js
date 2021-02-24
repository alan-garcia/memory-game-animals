import { Board } from './board.js';
const imagesConfig = {
    path: "images",
    extension: ".jpg"
};
const animals = ["leon", "elefante", "vaca", "perro", "mono", "oveja", "buho", "burro", "caballo", "cerdo", "gallo", "gato", "pato", "pavo", "pollito"];
let animalsFilled = [];
let imagesSelected;
let cells;
let cellsPositionsClicked;
let lockBoard = false;
let numberOfMovements = 0;
var time = 0;
const board = Board.getInstance();
board.setNumberOfMovements(numberOfMovements);
let difficultyList = document.querySelectorAll(".grid-animals-container__difficulty > div");
difficultyList.forEach(difficulty => difficulty.addEventListener("click", selectGameDifficulty));
function selectGameDifficulty(event) {
    let difficultySelected = event.currentTarget.className.split("--")[1];
    let numberOfDistinctAnimalsToShow = board.setDifficulty(difficultySelected);
    lockBoard = false;
    numberOfMovements = 0;
    imagesSelected = [];
    cellsPositionsClicked = [];
    animalsFilled = animals.slice(0, numberOfDistinctAnimalsToShow);
    animalsFilled = [...animalsFilled, ...animalsFilled];
    animalsFilled = board.shuffleImages(animalsFilled);
    document.querySelector(".select-difficulty-text").style.display = "none";
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
    if (board.isNotClickedInSameCell(cellsPositionsClicked)) {
        let thisAnimal = animalsFilled[cellPositionClicked];
        currentCell.innerHTML = `<img src='${imagesConfig.path}/${thisAnimal}${imagesConfig.extension}'/>`;
        if (currentCell.children[0].style.display !== "block") {
            currentCell.children[0].style.display = "block";
            currentCell.children[0].classList.add("animate-image-selected");
            imagesSelected.push(currentCell);
            currentCell.classList.remove("grid-animals__cell--hover");
            if (board.isCoupleSelected(imagesSelected)) {
                lockBoard = true;
                board.setNumberOfMovements(++numberOfMovements);
                cellsPositionsClicked = [];
                if (board.imagesSelectedAreNotEquals(imagesSelected)) {
                    time = setTimeout(() => {
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
