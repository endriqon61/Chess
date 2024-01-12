import GameProvider from "./context/gameContext"
import GamePage from "./pages/gamePage"

function App() {

  return <>
  <GameProvider>
    <GamePage />
  </GameProvider>
  </>
}

export default App
