import { Difficulty } from './difficulty';

export class Board {
  private static instance: Board;
  
  private constructor() { }

  public static getInstance(): Board {
    if (!Board.instance) {
      Board.instance = new Board();
    }
    return Board.instance;
  }

  create(numRows: number, numCells: number): void {
    let gridAnimalsDiv = <HTMLDivElement>document.querySelector(".grid-animals");

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

  createRow(gridAnimalsDiv: HTMLDivElement): HTMLDivElement {
    let gridAnimalsRowDiv: HTMLDivElement = document.createElement("div");
    let gridAnimalsRowClassDiv: Attr = document.createAttribute("class");
    gridAnimalsRowClassDiv.value = "grid-animals__row";
    gridAnimalsRowDiv.setAttributeNode(gridAnimalsRowClassDiv);
    gridAnimalsDiv.appendChild(gridAnimalsRowDiv);

    return gridAnimalsRowDiv;
  }

  createCell(gridAnimalsDiv: HTMLDivElement): HTMLDivElement {
    let gridAnimalsCellDiv: HTMLDivElement = document.createElement("div");
    let gridAnimalsCellClassDiv: Attr = document.createAttribute("class");
    gridAnimalsCellClassDiv.value = "grid-animals__cell";
    gridAnimalsCellDiv.setAttributeNode(gridAnimalsCellClassDiv);
    gridAnimalsDiv.appendChild(gridAnimalsCellDiv);

    return gridAnimalsCellDiv;
  }

  shuffleImages(animals: string[]): string[] {
    let temp: string;

    for (let i = animals.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      temp = animals[i];
      animals[i] = animals[j];
      animals[j] = temp;
    }

    return animals;
  }

  isNotClickedInSameCell(cellsPositionsClicked: number[]): boolean {
    return cellsPositionsClicked[0] !== cellsPositionsClicked[1];
  }

  isCoupleSelected(imagesSelected: HTMLDivElement[]): boolean {
    return imagesSelected.length === 2;
  }

  imagesSelectedAreNotEquals(imagesSelected: HTMLDivElement[]): boolean {
    return (<HTMLImageElement>imagesSelected[0].children[0]).src !== 
           (<HTMLImageElement>imagesSelected[1].children[0]).src;
  }

  hideFailSelectedCouple(imagesSelected: HTMLDivElement[]): void {
    imagesSelected[0].innerHTML = "";
    imagesSelected[0].classList.add("grid-animals__cell--hover");
    imagesSelected[1].innerHTML = "";
    imagesSelected[1].classList.add("grid-animals__cell--hover");
  }

  setDifficulty(difficultySelected: string): number {
    let numRows: number = 0;
    let numCells: number = 0;

    if (difficultySelected === Difficulty.EASY) {
      numRows = 2;
      numCells = 3;
    }
    else if (difficultySelected === Difficulty.MEDIUM) {
      numRows = 3;
      numCells = 4;
    }
    else if (difficultySelected === Difficulty.HARD) {
      numRows = 5;
      numCells = 6;
    }

    let numberOfDistinctAnimalsToShow: number = (numRows * numCells) / 2;
    this.create(numRows, numCells);

    return numberOfDistinctAnimalsToShow;
  }

  setNumberOfMovements(movement: number): void {
    (<HTMLSpanElement>document.querySelector(".number-movements")).textContent = movement.toString();
  }

  checkIfGameFinished(cells: NodeListOf<HTMLDivElement>): boolean {
    let cellsArray: HTMLDivElement[] = [...cells];
    let isGameFinished: boolean;

    let numberOfImagesDisplay = cellsArray.filter(cell => {
      if (cell.children.length > 0) {
        return (<HTMLElement>cell.children[0]).style.display === "block";
      }
    }).length;
  
    if (numberOfImagesDisplay === cellsArray.length) {
      this.showGameFinished();
      isGameFinished = true;
    }

    return isGameFinished;
  }

  showGameFinished(): void {
    (<HTMLSpanElement>document.getElementById("end-game-message")).style.display = "block";

    this.showGoBackMenuButton();
  }

  showGoBackMenuButton(): void {
    const menuGameElement: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById("menu-game");
    menuGameElement.style.display = "inline-block";
    menuGameElement.addEventListener("click", (): void => {
      const gridAnimalsDiv: HTMLDivElement = <HTMLDivElement>document.querySelector(".grid-animals");
      gridAnimalsDiv.style.display = "none";

      const gridAnimalsRowClassDiv: HTMLCollection = gridAnimalsDiv.children;
      [...gridAnimalsRowClassDiv].forEach(row => row.remove());

      (<HTMLParagraphElement>document.querySelector(".movements")).style.display = "none";
      (<HTMLParagraphElement>document.querySelector(".select-difficulty-text")).style.display = "block";
      (<HTMLParagraphElement>document.querySelector(".grid-animals-container__difficulty")).style.display = "block";
      (<HTMLSpanElement>document.getElementById("end-game-message")).style.display = "none";
      (<HTMLAnchorElement>document.getElementById("menu-game")).style.display = "none";

      this.setNumberOfMovements(0);
      clearTimeout(globalThis.time);
    });
  }
}
