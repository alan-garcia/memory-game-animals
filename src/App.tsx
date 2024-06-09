import React, { useState } from 'react';
import './App.css'

function App() {
  const [openJugar, setOpenJugar] = useState(false);
  const [celdas, setCeldas] = useState<JSX.Element[]>([]);

  const getDificultad = (event) => {
    let numFilas = 0;
    let numCeldas = 0;
    const dificultad  = event.target.dataset.dificultad;

    switch (dificultad) {
      case 'facil':
        numFilas = 2;
        numCeldas = 3;
        break;
      case 'medio':
        numFilas = 3;
        numCeldas = 4;
        break;
      case 'dificil':
        numFilas = 5;
        numCeldas = 6;
        break;
      default:
        break;
    }

    setCeldas(generarCeldas(numFilas, numCeldas));
    setOpenJugar(true);
  }

  const generarCeldas = (numFilas: number, numCeldas: number): JSX.Element[] => {
    const filas: JSX.Element[] = [];

    for (let i = 0; i < numFilas; i++) {
      const celdas: JSX.Element[] = [];

      for (let j = 0; j < numCeldas; j++) {
        celdas.push(<div key={`celda-${i}-${j}`} className="celda"></div>);
      }
      
      filas.push(
        <div key={`fila-${i}`} className="parejas-animales-fila">
          {celdas}
        </div>
      );
    }
    
    return filas;
  };

  const reiniciarPartida = () => setOpenJugar(false);

  return (
    <>
    { !openJugar ? (
      <div className="parejas-inicio-container">
        <h1>Juego de parejas de animales</h1>
        <p>Seleccione el nivel de dificultad:</p>
        <div className="parejas-dificultad">
          <div className="parejas-dificultad-recuadro dificultad-facil" onClick={getDificultad} data-dificultad="facil">Fácil</div>
          <div className="parejas-dificultad-recuadro dificultad-medio" onClick={getDificultad} data-dificultad="medio">Medio</div>
          <div className="parejas-dificultad-recuadro dificultad-dificil" onClick={getDificultad} data-dificultad="dificil">Difícil</div>
        </div>
      </div>
    ) : (
      <div className="parejas-inicio-container">
        <h1>Juego de parejas de animales</h1>
        <div className="parejas-animales-container">
          {celdas}
        </div>
        <button className="parejas-volver-menu" onClick={reiniciarPartida}>Volver al menú</button>
      </div>
    )}
    </>
  )
}

export default App
