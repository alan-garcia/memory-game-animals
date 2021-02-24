export class Board {
    constructor() { }
    static getInstance() {
        if (!Board.instance) {
            Board.instance = new Board();
        }
        return Board.instance;
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
        let temp;
        for (let i = animals.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            temp = animals[i];
            animals[i] = animals[j];
            animals[j] = temp;
        }
        return animals;
    }
    isNotClickedInSameCell(cellsPositionsClicked) {
        return cellsPositionsClicked[0] !== cellsPositionsClicked[1];
    }
    isCoupleSelected(imagesSelected) {
        return imagesSelected.length === 2;
    }
    imagesSelectedAreNotEquals(imagesSelected) {
        return imagesSelected[0].children[0].src !== imagesSelected[1].children[0].src;
    }
    hideFailSelectedCouple(imagesSelected) {
        imagesSelected[0].innerHTML = "";
        imagesSelected[0].classList.add("grid-animals__cell--hover");
        imagesSelected[1].innerHTML = "";
        imagesSelected[1].classList.add("grid-animals__cell--hover");
    }
    setDifficulty(difficultySelected) {
        let numRows = 0;
        let numCells = 0;
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
        let numberOfDistinctAnimalsToShow = (numRows * numCells) / 2;
        this.create(numRows, numCells);
        return numberOfDistinctAnimalsToShow;
    }
    setNumberOfMovements(movement) {
        const endGameMessage = document.querySelector(".number-movements");
        endGameMessage.textContent = movement;
    }
    checkIfGameFinished(cells) {
        let cellsArray = [...cells];
        let isGameFinished;
        let numberOfImagesDisplay = cellsArray.filter(cell => {
            if (cell.children.length > 0) {
                return cell.children[0].style.display === "block";
            }
        }).length;
        if (numberOfImagesDisplay === cellsArray.length) {
            this.showGameFinished();
            isGameFinished = true;
        }
        return isGameFinished;
    }
    showGameFinished() {
        const endGameMessage = document.getElementById("end-game-message");
        endGameMessage.style.display = "block";
        this.showGoBackMenuButton();
    }
    showGoBackMenuButton() {
        const menuGame = document.getElementById("menu-game");
        menuGame.style.display = "inline-block";
        menuGame.addEventListener("click", () => {
            const gridAnimalsDiv = document.querySelector(".grid-animals");
            const gridAnimalsRowClassDiv = gridAnimalsDiv.children;
            [...gridAnimalsRowClassDiv].forEach(row => row.remove());
            gridAnimalsDiv.style.display = "none";
            document.querySelector(".movements").style.display = "block";
            document.querySelector(".select-difficulty-text").style.display = "none";
            document.querySelector(".grid-animals-container__difficulty").style.display = "block";
            document.getElementById("end-game-message").style.display = "none";
            document.getElementById("menu-game").style.display = "none";
            this.setNumberOfMovements(0);
            clearTimeout(globalThis.time);
        });
    }
}
