import { useEffect, useState } from "react"
import { Piece, Position } from "../chess/piece"
import useGameState from "../hooks/useGameState"
import Color from "../enums/player"
import { Chess } from "../chess/chess"

const Square = ({ piece, squarePosition }: { piece: Piece | null, squarePosition: Position }) => {

    const { gameState, setGameState } = useGameState()

    const [ isLegal, setIsLegal] = useState(false)

    function createReference(obj: Piece) {
    const reference = new Piece({row: 0, col: 0}, Color.Black, "p");
    Object.assign(reference, obj);
    return reference;
    }

    useEffect(() => {
        setIsLegal(false)
        if(gameState.currentPiece) 
            for(let move of gameState.currentPiece?.getLegalMoves()) {
                if([squarePosition.row, squarePosition.col].join(",") ==
                 move.join(",")) {
                   setIsLegal(true) 
                }                 
            }
    }, [gameState.currentPiece])

    return <>

        <div
            onClick={() => {

                // gameState.board.forEach(i => {
                //         i.calculateLegalMoves(gameState.board)  
                // }
                // )

                if (gameState.currentPiece) {

                    // gameState.currentPiece.calculateVision(gameState.board)
                    if(gameState.currentPiece.getColor() == piece?.getColor()) {
                        piece.calculateLegalMoves(gameState.board)
                        piece.filterCheckMoves(gameState.board)
                        console.log("")
                        return setGameState({...gameState, currentPiece: piece})
                    }

                    if(isLegal) {

                        const newPieces = gameState.currentPiece.moveTo(squarePosition, gameState.board)

                        // newPieces.forEach(p => p.calculateLegalMoves(newPieces))
                        const check = Chess.WhoInCheck(newPieces) 
                        console.log("Current Chekc", check)
                        gameState.currentPiece.calculateLegalMoves(newPieces)
                        if(check.length) {
                            alert( `Check ${check.includes(Color.White) ? "White" : "Black"}`)
                        }
                        setGameState({
                            ...gameState,
                            currentPiece: null,
                            board: newPieces.map(i => createReference(i)),
                            isPlaying: gameState.isPlaying == Color.White ? Color.Black : Color.White
                        })

                    } else {

                        setGameState({
                            ...gameState,
                            currentPiece: null
                        })

                    }

                } else {
                    if(piece) {

                        if(piece.getColor() != gameState.isPlaying) return;

                        piece.calculateLegalMoves(gameState.board)
                        piece.filterCheckMoves(gameState.board)
                        setGameState({ ...gameState, currentPiece: piece })

                    }
                }

            }}
            className={`w-full ${gameState.currentPiece && JSON.stringify(gameState.currentPiece?.getPosition()) === JSON.stringify(piece?.getPosition()) ? "bg-rose-500/75" : isLegal ? "bg-emerald-500/75": ""} h-full absolute flex items-center justify-center top-0`}>
            {piece && <img className='object-contain object-center w-[80%] h-[80%]' src={`./src/ChessSprites/${piece?.getColor() == Color.White ? "white" : "black"}/${piece?.getTypePiece()}.png`} />}
        </div>
    </>

}

export default Square