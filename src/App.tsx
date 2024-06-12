import { useEffect, useState, useCallback } from 'react';
import './App.css';
import imagenes from './imagenes';
import Dificultad from './dificultad';

function App() {
  const [openJugar, setOpenJugar] = useState(false);
  const [numFilas, setNumFilas] = useState(0);
  const [numCeldas, setNumCeldas] = useState(0);
  const [movimientos, setMovimientos] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [indicesImagenesVolteadas, setIndicesImagenesVolteadas] = useState<number[]>([]);
  const [indicesImagenesCoincidentes, setIndicesImagenesCoincidentes] = useState<number[]>([]);

  const selectDificultad = (event: React.MouseEvent<HTMLDivElement>) => {
    let filas: number = 0;
    let celdas: number = 0;
    const target = event.target as HTMLDivElement;
    const dificultad: string | undefined = target.dataset.dificultad;

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

    setImages(generarParejaImagenes(numeroParejas));
    setOpenJugar(true);
  };

  const generarParejaImagenes = (numeroParejas: number) => {
    const images: string[] = [];
    for (let i: number = 0; i < numeroParejas; i++) {
      const img: string = imagenes[i % imagenes.length].src;
      images.push(img, img);
    }
    
    return images.sort(() => Math.random() - 0.5);
  };

  const voltear = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    let indice: number = 0;

    if (target.firstChild) {
      const firstChild = target.firstChild as HTMLElement;
      const indiceString = firstChild.dataset.indice;
      if (indiceString !== undefined) {
        indice = parseInt(indiceString, 10);
      }
    }
    else if (target.parentElement && target.parentElement.firstChild) {
      const parentFirstChild = target.parentElement.firstChild as HTMLElement;
      const indiceString = parentFirstChild.dataset.indice;
      if (indiceString !== undefined) {
        indice = parseInt(indiceString, 10);
      }
    }
    // const indice: number = (target.firstChild === null) ? target.parentElement.firstChild.dataset.indice : target.firstChild.dataset.indice;
    if (existenParejasPorVoltear() && !parejasPorVoltearCoinciden(indice) && !parejasSeleccionadasCoinciden(indice)) {
      target.classList.add("flipped");
      setIndicesImagenesVolteadas((prev) => [...prev, indice]);
    }
    else if (parejasSeleccionadas()) {
      setMovimientos(movimientos => movimientos + 1);
      const [firstIndex, secondIndex] = indicesImagenesVolteadas;
      if (images[firstIndex] === images[secondIndex]) {
        setIndicesImagenesCoincidentes((prev) => [...prev, firstIndex, secondIndex]);
        setIndicesImagenesVolteadas([]);
      }
      else {
        setTimeout(() => {
          enderezarParejasSeleccionadas();
          setIndicesImagenesVolteadas([]);
        }, 1000);
      }
    }
  };

  const generarCeldas = () => {
    const filas: JSX.Element[] = [];
    let indice: number = 0;

    for (let i: number = 0; i < numFilas; i++) {
      const celdas: JSX.Element[] = [];
      for (let j: number = 0; j < numCeldas; j++) {
        celdas.push(
          <div key={`celda-${i}-${j}`}
            className={`celda ${indicesImagenesVolteadas.includes(indice) || indicesImagenesCoincidentes.includes(indice) ? 'flipped' : ''}`}
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

  const parejasSeleccionadas = useCallback(() => {
    return indicesImagenesVolteadas.length === 2;
  }, [indicesImagenesVolteadas]);

  const existenParejasPorVoltear = () => indicesImagenesVolteadas.length < 2;

  const parejasPorVoltearCoinciden = (indice: number) => indicesImagenesVolteadas.includes(indice);

  const parejasSeleccionadasCoinciden = (indice: number) => indicesImagenesCoincidentes.includes(indice);

  const enderezarParejasSeleccionadas = useCallback(() => {
    indicesImagenesVolteadas.filter(indice => {
      if (indice !== indicesImagenesCoincidentes[indice]) {
        document.querySelectorAll(".celda")[indice].classList.remove("flipped");
      } 
    });
  }, [indicesImagenesVolteadas, indicesImagenesCoincidentes]);

  const reiniciarPartida = () => {
    setOpenJugar(false);
    setMovimientos(0);
    setIndicesImagenesVolteadas([]);
    setIndicesImagenesCoincidentes([]);
  };

  useEffect(() => {
    if (parejasSeleccionadas()) {
      setMovimientos(movimientos => movimientos + 1);
      const [firstIndex, secondIndex] = indicesImagenesVolteadas;
      if (images[firstIndex] === images[secondIndex]) {
        setIndicesImagenesCoincidentes((prev) => [...prev, firstIndex, secondIndex]);
        setIndicesImagenesVolteadas([]);
      }
      else {
        setTimeout(() => {
          enderezarParejasSeleccionadas();
          setIndicesImagenesVolteadas([]);
        }, 1000);
      }
    }
  }, [images, indicesImagenesVolteadas, indicesImagenesCoincidentes, parejasSeleccionadas, enderezarParejasSeleccionadas])

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
          <p className="movimientos">{movimientos} movimientos</p>
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
