import Board from "./components/Board"
import GameProvider from "./context/gameContext"
import "./App.css"
import Color from "./enums/player"

function App() {

  return <>
  <GameProvider>
    <div className="relative">
      <Board currentPlayerColor={Color.White} /> 
    </div>
  </GameProvider>
  </>
}

export default App
