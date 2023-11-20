import { useContext } from "react"
import { GameContext } from "../context/gameContext"

const useGameState = () => {
    const {gameState, setGameState} = useContext(GameContext)
    return {gameState, setGameState}
}

export default useGameState