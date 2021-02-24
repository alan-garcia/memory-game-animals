export class Board {
  private static instance: Board;

  private constructor() { }

  public static getInstance(): Board {
    if (!Board.instance) {
      Board.instance = new Board();
    }
    return Board.instance;
  }

  create(numRows: number, numCells: number) {
    let gridAnimalsDiv = document.querySelector(".grid-animals") as HTMLDivElement;

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

  createRow(gridAnimalsDiv: HTMLDivElement) {
    let gridAnimalsRowDiv: HTMLDivElement = document.createElement("div");
    let gridAnimalsRowClassDiv: Attr = document.createAttribute("class");
    gridAnimalsRowClassDiv.value = "grid-animals__row";
    gridAnimalsRowDiv.setAttributeNode(gridAnimalsRowClassDiv);
    gridAnimalsDiv.appendChild(gridAnimalsRowDiv);

    return gridAnimalsRowDiv;
  }

  createCell(gridAnimalsDiv: any) {
    let gridAnimalsCellDiv: HTMLDivElement = document.createElement("div");
    let gridAnimalsCellClassDiv: Attr = document.createAttribute("class");
    gridAnimalsCellClassDiv.value = "grid-animals__cell";
    gridAnimalsCellDiv.setAttributeNode(gridAnimalsCellClassDiv);
    gridAnimalsDiv.appendChild(gridAnimalsCellDiv);

    return gridAnimalsCellDiv;
  }

  shuffleImages(animals: string[]) {
    let temp: string;

    for (let i = animals.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      temp = animals[i];
      animals[i] = animals[j];
      animals[j] = temp;
    }
    return animals;
  }

  isNotClickedInSameCell(cellsPositionsClicked: number[]) {
    return cellsPositionsClicked[0] !== cellsPositionsClicked[1];
  }

  isCoupleSelected(imagesSelected: HTMLDivElement[]) {
    return imagesSelected.length === 2;
  }

  imagesSelectedAreNotEquals(imagesSelected: HTMLDivElement[]) {
    return (imagesSelected[0].children[0] as HTMLImageElement).src !== (imagesSelected[1].children[0] as HTMLImageElement).src;
  }

  hideFailSelectedCouple(imagesSelected: HTMLDivElement[]) {
    imagesSelected[0].innerHTML = "";
    imagesSelected[0].classList.add("grid-animals__cell--hover");
    imagesSelected[1].innerHTML = "";
    imagesSelected[1].classList.add("grid-animals__cell--hover");
  }

  setDifficulty(difficultySelected: string): number {
    let numRows: number = 0;
    let numCells: number = 0;

    if (difficultySelected === "easy") {
      numRows = 2;
      numCells = 3;
    }
    else if (difficultySelected === "medium") {
      numRows = 3;
      numCells = 4;
    }
    else if (difficultySelected === "hard") {
      numRows = 5;
      numCells = 6;
    }

    let numberOfDistinctAnimalsToShow: number = (numRows * numCells) / 2;
    this.create(numRows, numCells);

    return numberOfDistinctAnimalsToShow;
  }

  setNumberOfMovements(movement: number) {
    const endGameMessage: HTMLSpanElement = document.querySelector(".number-movements") as HTMLSpanElement;
    endGameMessage.textContent = (movement as unknown) as string;
  }

  checkIfGameFinished(cells: NodeListOf<HTMLDivElement>): boolean {
    let cellsArray: HTMLDivElement[] = [...cells];
    let isGameFinished: boolean;

    let numberOfImagesDisplay = cellsArray.filter(cell => {
      if (cell.children.length > 0) {
        return (cell.children[0] as HTMLElement).style.display === "block";
      }
    }).length;
  
    if (numberOfImagesDisplay === cellsArray.length) {
      this.showGameFinished();
      isGameFinished = true;
    }

    return isGameFinished;
  }

  showGameFinished() {
    const endGameMessage: HTMLSpanElement = document.getElementById("end-game-message") as HTMLSpanElement;
    endGameMessage.style.display = "block";

    this.showGoBackMenuButton();
  }

  showGoBackMenuButton() {
    const menuGame: HTMLAnchorElement = document.getElementById("menu-game") as HTMLAnchorElement;
    menuGame.style.display = "inline-block";
    menuGame.addEventListener("click", (): void => {
      const gridAnimalsDiv: HTMLDivElement = document.querySelector(".grid-animals") as HTMLDivElement;
      const gridAnimalsRowClassDiv: HTMLCollection = gridAnimalsDiv.children;
      [...gridAnimalsRowClassDiv].forEach(row => row.remove());

      gridAnimalsDiv.style.display = "none";
      (document.querySelector(".movements") as HTMLParagraphElement).style.display = "block";
      (document.querySelector(".select-difficulty-text") as HTMLParagraphElement).style.display = "none";
      (document.querySelector(".grid-animals-container__difficulty") as HTMLParagraphElement).style.display = "block";
      (document.getElementById("end-game-message") as HTMLSpanElement).style.display = "none";
      (document.getElementById("menu-game") as HTMLAnchorElement).style.display = "none";

      this.setNumberOfMovements(0);
      clearTimeout(globalThis.time);
    });
  }
}
