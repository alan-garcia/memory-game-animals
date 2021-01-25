"use strict";

class Board {
  constructor() { }

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
}