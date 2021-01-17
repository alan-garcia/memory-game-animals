"use strict";

let imagesConfig = {
  path: "images",
  extension: ".jpg"
}

let images = ["leon", "elefante", "vaca"];
let imagesCopy = [...images];
let imagesFilled = [];
let imagesSelected = [];

let cells = document.querySelectorAll(".grid-animals-cell");
cells.forEach(cell => {
  cell.classList.add("grid-animals-cell_hover");
  let randomImagePosition = Math.floor(Math.random() * imagesCopy.length);
  let imageName = imagesCopy[randomImagePosition];

  cell.innerHTML = `<img src='${ imagesConfig.path }/${ imageName }${ imagesConfig.extension}'/>`;
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

cells.forEach(cell => {
  cell.addEventListener("click", (event) => {
    let currentCell = event.currentTarget;
    let thisAnimal = currentCell.children[0];
    
    thisAnimal.style.display = "table-cell";
    imagesSelected.push(thisAnimal);
    currentCell.classList.remove("grid-animals-cell_hover");

    if (isCoupleSelected()) {
      if (imagesSelected[0].src !== imagesSelected[1].src) {
        setTimeout(() => {
          hideFailSelectedCouple(imagesSelected);
          imagesSelected = [];
        }, 1200);
      }
    }
  });
});

function isCoupleSelected() {
  return imagesSelected.length === 2;
}

function hideFailSelectedCouple(imagesSelected) {
  imagesSelected[0].style.display = "none";
  imagesSelected[0].parentElement.classList.add("grid-animals-cell_hover");
  imagesSelected[1].style.display = "none";
  imagesSelected[1].parentElement.classList.add("grid-animals-cell_hover");
}