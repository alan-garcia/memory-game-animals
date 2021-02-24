import { Board } from './board';

const imagesConfig = {
  path: "images",
  extension: ".jpg"
}

const animals: string[] = ["leon", "elefante", "vaca", "perro", "mono", "oveja", "buho", "burro", "caballo", "cerdo", "gallo", "gato", "pato", "pavo", "pollito"];
let animalsFilled: string[] = [];
let imagesSelected: HTMLDivElement[];
let cells: NodeListOf<HTMLDivElement>;
let cellsPositionsClicked: number[];
let lockBoard: boolean = false;
let numberOfMovements: number = 0;
var time: number = 0;

const board = Board.getInstance();
board.setNumberOfMovements(numberOfMovements);

let difficultyList: NodeListOf<HTMLDivElement> = document.querySelectorAll(".grid-animals-container__difficulty > div");
difficultyList.forEach(difficulty => difficulty.addEventListener("click", selectGameDifficulty));

function selectGameDifficulty(event: any) {
  let difficultySelected: string = event.currentTarget.className.split("--")[1];
  let numberOfDistinctAnimalsToShow: number = board.setDifficulty(difficultySelected);

  lockBoard = false;
  numberOfMovements = 0;
  imagesSelected = [];
  cellsPositionsClicked = [];
  animalsFilled = animals.slice(0, numberOfDistinctAnimalsToShow);
  animalsFilled = [...animalsFilled, ...animalsFilled];
  animalsFilled = board.shuffleImages(animalsFilled);

  (document.querySelector(".select-difficulty-text") as HTMLParagraphElement).style.display = "none";
  (document.querySelector(".movements") as HTMLParagraphElement).style.display = "block";
  (document.querySelector(".grid-animals-container__difficulty") as HTMLParagraphElement).style.display = "none";
  (document.querySelector(".grid-animals") as HTMLParagraphElement).style.display = "block";

  cells = document.querySelectorAll(".grid-animals__cell");
  cells.forEach(cell => cell.addEventListener("click", flipCard));
}

function flipCard(event: any) {
  if (lockBoard) {
    return;
  }
  let currentCell: HTMLDivElement = event.currentTarget;
  let cellPositionClicked: number = [...cells].indexOf(currentCell);
  cellsPositionsClicked.push(cellPositionClicked);

  // Controla que no sea posible repetir la selección de la pareja hasta que no se seleccione otra celda distinta a la primera imagen.
  if (board.isNotClickedInSameCell(cellsPositionsClicked)) {
    let thisAnimal: string = animalsFilled[cellPositionClicked];
    currentCell.innerHTML = `<img src='${ imagesConfig.path }/${ thisAnimal }${ imagesConfig.extension }'/>`;
    if ((currentCell.children[0] as HTMLElement).style.display !== "block") {
      (currentCell.children[0] as HTMLElement).style.display = "block";
      (currentCell.children[0] as HTMLElement).classList.add("animate-image-selected");
      imagesSelected.push(currentCell);
      currentCell.classList.remove("grid-animals__cell--hover");
      if (board.isCoupleSelected(imagesSelected)) {
        lockBoard = true;
        board.setNumberOfMovements(++numberOfMovements);
        cellsPositionsClicked = [];
        if (board.imagesSelectedAreNotEquals(imagesSelected)) {
          time = setTimeout((): void => {
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
