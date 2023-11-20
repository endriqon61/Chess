import { createContext, useContext, useState } from "react"
import { Piece, Position } from "../chess/piece"
import Color from "../enums/player"
import { Chess } from "../chess/chess"
import { Dispatch, SetStateAction } from "react"

interface gameState {
    board: Piece[],
    isPlaying: Color,
    currentPiece: Piece | null
}

const startingFEN = '8/8/8/4K3/8/3k4/8/2R5 w KQkq - 0 1';
const startingPieces = Chess.parseFEN(startingFEN)

const initialGameState = {
    board: startingPieces,
    isPlaying: Color.White,
    currentPiece: null
}

export const GameContext = createContext<{gameState: gameState, setGameState: Dispatch<SetStateAction<gameState>>}>({gameState: initialGameState, setGameState: () => {}})

const gameContext = ({children}: {children: JSX.Element}) => {

    const [gameState, setGameState] = useState<gameState>(initialGameState)

    return <> 
    <GameContext.Provider value={{gameState, setGameState}}>
    {children}
    </GameContext.Provider>
    </>
}

export default gameContext