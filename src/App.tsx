import React from 'react'
import './App.css'

function App() {
  return (
    <>
      <div className="parejas-inicio-container">
        <h1>Juego de parejas de animales</h1>
        <p>Seleccione el nivel de dificultad:</p>
        <div className="parejas-dificultad">
          <div className="parejas-dificultad-recuadro dificultad-facil">Fácil</div>
          <div className="parejas-dificultad-recuadro dificultad-medio">Medio</div>
          <div className="parejas-dificultad-recuadro dificultad-dificil">Difícil</div>
        </div>
      </div>
    </>
  )
}

export default App
