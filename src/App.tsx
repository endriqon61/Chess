import Board from "./components/Board"
import GameProvider from "./context/gameContext"
import "./App.css"
import Color from "./enums/player"

function App() {

  return <>
  <GameProvider>
  <Board currentPlayerColor={Color.White} /> 
  </GameProvider>
  </>
}

export default App
