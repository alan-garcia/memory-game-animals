import { useEffect, useState } from 'react';
import './App.css';
import imagenes from './imagenes';
import Dificultad from './dificultad';

function App() {
  const [openJugar, setOpenJugar] = useState(false);
  const [partidaTerminada, setPartidaTerminada] = useState(false);
  const [numFilas, setNumFilas] = useState(0);
  const [numCeldas, setNumCeldas] = useState(0);
  const [movimientos, setMovimientos] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [indicesImagenesVolteadas, setIndicesImagenesVolteadas] = useState<number[]>([]);
  const [indicesImagenesCoincidentes, setIndicesImagenesCoincidentes] = useState<number[]>([]);

  const CONFIGURACION_DIFICULTAD = {
    [Dificultad.FACIL]: { filas: 2, celdas: 3, label: "Fácil" },
    [Dificultad.MEDIO]: { filas: 3, celdas: 4, label: "Medio" },
    [Dificultad.DIFICIL]: { filas: 5, celdas: 6, label: "Difícil" },
  } satisfies Record<Dificultad, { filas: number; celdas: number; label: string }>;

  const niveles: Dificultad[] = [
    Dificultad.FACIL,
    Dificultad.MEDIO,
    Dificultad.DIFICIL,
  ];

  const seleccionarDificultad = (nivel: Dificultad) => {
    const { filas, celdas } = CONFIGURACION_DIFICULTAD[nivel];

    setNumFilas(filas);
    setNumCeldas(celdas);
    setPartidaTerminada(false);
    setOpenJugar(true);

    const numeroParejas: number = (filas * celdas) / 2;
    setImages(generarParejaImagenes(numeroParejas));
  };

  function mezclar<T>(array: T[]): T[] {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  const generarParejaImagenes = (numeroParejas: number) => {
    const images: string[] = [];

    for (let i = 0; i < numeroParejas; i++) {
      const img = imagenes[i % imagenes.length].src;
      images.push(img, img);
    }

    return mezclar(images);
  };

  const voltear = (indice: number) => {
    const yaEstaVolteada = indicesImagenesVolteadas.includes(indice);
    const yaEstaAcierto = indicesImagenesCoincidentes.includes(indice);
    const hayDosCartas = indicesImagenesVolteadas.length === 2;

    if (yaEstaVolteada || yaEstaAcierto || hayDosCartas) return;

    const nuevas = [...indicesImagenesVolteadas, indice];
    setIndicesImagenesVolteadas(nuevas);
  };

  const generarCeldas = () => {
    if (!numFilas || !numCeldas || images.length === 0)
      return null;

    let indice = 0;

    return Array.from({ length: numFilas }, (_, i) => (
      <div key={`fila-${i}`} className="parejas-animales-fila">
        {Array.from({ length: numCeldas }, (_, j) => {
          const actualIndice = indice++;

          const flipped =
            indicesImagenesVolteadas.includes(actualIndice) ||
            indicesImagenesCoincidentes.includes(actualIndice);

          const isMatch = indicesImagenesCoincidentes.includes(actualIndice);

          return (
            <div key={`celda-${i}-${j}`} className={`celda ${flipped ? "flipped" : ""} ${isMatch ? "match" : ""}`}
              onClick={() => voltear(actualIndice)}
            >
              <div className="back" style={{ backgroundImage: `url(${images[actualIndice]})` }}/>
            </div>
          );
        })}
      </div>
    ));
  };

  const reiniciarPartida = () => {
    setOpenJugar(false);
    setMovimientos(0);
    setIndicesImagenesVolteadas([]);
    setIndicesImagenesCoincidentes([]);
  };

  useEffect(() => {
    if (indicesImagenesVolteadas.length !== 2) return;

    setMovimientos((mov) => mov + 1);

    const [firstIndex, secondIndex] = indicesImagenesVolteadas;

    const imagenCoincide = images[firstIndex] === images[secondIndex];
    if (imagenCoincide) {
      setIndicesImagenesCoincidentes((prev) => {
        const updated = [...prev, firstIndex, secondIndex];
        if (updated.length === images.length) {
          setPartidaTerminada(true);
        }

        return updated;
      });

      setIndicesImagenesVolteadas([]);
      return;
    }

    setTimeout(() => {
      setIndicesImagenesVolteadas([]);
    }, 1000);
  }, [indicesImagenesVolteadas, images]);

  return (
    <div className="parejas-inicio-container">
      <h1>Juego de parejas de animales</h1>

      {!openJugar ? (
        <>
          <p>Seleccione el nivel de dificultad:</p>

          <div className="parejas-dificultad">
            {niveles.map((nivel) => (
              <div key={nivel}
                className={`parejas-dificultad-recuadro dificultad-${nivel}`}
                onClick={() => seleccionarDificultad(nivel)}
              >
                {CONFIGURACION_DIFICULTAD[nivel].label}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="movimientos">{movimientos} movimientos</p>

          <div className="parejas-animales-container">
            {generarCeldas()}
          </div>

          {partidaTerminada && (
            <div className="partida-finalizada">
              ¡Partida finalizada!
            </div>
          )}

          <button className="parejas-volver-menu" onClick={reiniciarPartida}>
            Volver al menú
          </button>
        </>
      )}
    </div>
  );
}

export default App;
