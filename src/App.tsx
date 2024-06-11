import React, { useEffect, useState } from 'react';
import './App.css';
import imagenes from './imagenes';
import Dificultad from './dificultad';

function App() {
  const [openJugar, setOpenJugar] = useState(false);
  const [numFilas, setNumFilas] = useState(0);
  const [numCeldas, setNumCeldas] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIndices, setMatchedIndices] = useState<number[]>([]);

  const selectDificultad = (event) => {
    let filas: number = 0;
    let celdas: number = 0;
    const dificultad: string = event.target.dataset.dificultad;

    switch (dificultad) {
      case Dificultad.FACIL:
        filas = 2;
        celdas = 3;
        break;
      case Dificultad.MEDIO:
        filas = 3;
        celdas = 4;
        break;
      case Dificultad.DIFICIL:
        filas = 5;
        celdas = 6;
        break;
      default:
        break;
    }

    setNumFilas(filas);
    setNumCeldas(celdas);
    const numeroParejas: number = (filas * celdas) / 2;

    setImages(generateImagePairs(numeroParejas));
    setOpenJugar(true);
  };

  const generateImagePairs = (numeroParejas: number) => {
    const images: string[] = [];
    for (let i: number = 0; i < numeroParejas; i++) {
      const img: string = imagenes[i % imagenes.length].src;
      images.push(img, img);
    }
    
    return images.sort(() => Math.random() - 0.5);
  };

  const voltear = (event) => {
    const indice: number = (event.target.firstChild === null) ? event.target.parentElement.firstChild.dataset.indice : event.target.firstChild.dataset.indice;
    if (flippedIndices.length < 2 && !flippedIndices.includes(indice) && !matchedIndices.includes(indice)) {
      event.target.classList.add("flipped");
      setFlippedIndices((prev) => [...prev, indice]);
    }
    else if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      if (images[firstIndex] === images[secondIndex]) {
        setMatchedIndices((prev) => [...prev, firstIndex, secondIndex]);
        setFlippedIndices([]);
      }
      else {
        setTimeout(() => {
          flippedIndices.filter(ind => {
            if (ind !== matchedIndices[ind]) {
              document.querySelectorAll(".celda")[ind].classList.remove("flipped");
            } 
          });
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      if (images[firstIndex] === images[secondIndex]) {
        setMatchedIndices((prev) => [...prev, firstIndex, secondIndex]);
        setFlippedIndices([]);
      }
      else {
        setTimeout(() => {
          flippedIndices.filter(ind => {
            if (ind !== matchedIndices[ind]) {
              document.querySelectorAll(".celda")[ind].classList.remove("flipped");
            } 
          });
          setFlippedIndices([]);
        }, 1000);
      }
    }
  }, [flippedIndices, images, matchedIndices]);

  const generarCeldas = () => {
    const filas: JSX.Element[] = [];
    let indice: number = 0;

    for (let i: number = 0; i < numFilas; i++) {
      const celdas: JSX.Element[] = [];
      for (let j: number = 0; j < numCeldas; j++) {
        celdas.push(
          <div key={`celda-${i}-${j}`}
            className={`celda ${flippedIndices.includes(indice) || matchedIndices.includes(indice) ? 'flipped' : ''}`}
            onClick={(event) => voltear(event)}
          >
            <div className="back" data-indice={indice} style={{ backgroundImage: `url(${images[indice]})` }}></div>
          </div>
        );
        indice++;
      }
      filas.push(
        <div key={`fila-${i}`} className="parejas-animales-fila">
          {celdas}
        </div>
      );
    }
    return filas;
  };

  const reiniciarPartida = () => {
    setOpenJugar(false);
    setFlippedIndices([]);
    setMatchedIndices([]);
  };

  return (
    <>
      {!openJugar ? (
        <div className="parejas-inicio-container">
          <h1>Juego de parejas de animales</h1>
          <p>Seleccione el nivel de dificultad:</p>
          <div className="parejas-dificultad">
            <div className="parejas-dificultad-recuadro dificultad-facil" onClick={selectDificultad} data-dificultad={Dificultad.FACIL}>Fácil</div>

            <div className="parejas-dificultad-recuadro dificultad-medio" onClick={selectDificultad} data-dificultad={Dificultad.MEDIO}>Medio</div>

            <div className="parejas-dificultad-recuadro dificultad-dificil" onClick={selectDificultad} data-dificultad={Dificultad.DIFICIL}>Difícil</div>
          </div>
        </div>
      ) : (
        <div className="parejas-inicio-container">
          <h1>Juego de parejas de animales</h1>
          <div className="parejas-animales-container">{generarCeldas()}</div>
          <button className="parejas-volver-menu" onClick={reiniciarPartida}>
            Volver al menú
          </button>
        </div>
      )}
    </>
  );
}

export default App;
