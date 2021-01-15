"use strict";

let imagesConfig = {
  path: "images",
  extension: ".jpg"
}

let images = ["leon", "elefante", "vaca"];
let imagesCopy = [...images];
let imagesFilled = [];

let cells = document.querySelectorAll(".grid-animals-cell");
cells.forEach((cell) => {
  let randomImagePosition = Math.floor(Math.random() * imagesCopy.length);
  let imageName = imagesCopy[randomImagePosition];

  cell.innerHTML = `<img src='${ imagesConfig.path }/${ imageName }${ imagesConfig.extension}'/>`;
  imagesFilled.push(imageName);

  let numberOfCurrentAnimalOnBoard = imagesFilled.filter(animalName => animalName === imageName).length;
  if (numberOfCurrentAnimalOnBoard === 2) {
    imagesCopy = imagesCopy.filter(image => image !== imageName);
  }
});
