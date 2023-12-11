import { useEffect, useState } from 'react'
import defaultTiles from '../utils/tiles'
import Color from '../enums/player'
import { Chess } from '../chess/chess'
import { Piece, Position } from '../chess/piece'
import Square from './Square'
import useGameState from '../hooks/useGameState'

interface Props {
  currentPlayerColor: Color
}

const Board = ({currentPlayerColor}: Props) => {


  const [tiles, setTiles] = useState<typeof defaultTiles>(defaultTiles)
  const {gameState, setGameState} = useGameState()
  const { board: pieces, isPlaying } = gameState

  useEffect(() => {
    if(currentPlayerColor == Color.Black)
      setTiles({letters: defaultTiles.letters, numbers: [...defaultTiles.numbers].reverse()})
    else 
      setTiles(defaultTiles)
  }, [isPlaying])

  return (
    <>
      <div className='grid grid-rows-8 w-[630px] max-w-[90vw] aspect-square'>
        {tiles.numbers.map((number: any) => {
          return <div className='grid grid-cols-8 h-full w-full'>
            {tiles.letters.map((letter: any, index2: number) => {
              const piece = pieces.find(piece => piece.getPosition().row == number && piece.getPosition().col == index2 + 1) 
              return <span data-tile={`${letter}${number}`} className={`w-full relative text-lg text-center ${(number + index2 - 1) % 2 == 0 ? 'bg-cyan-800 text-white': 'bg-indigo-100 text-black'}  h-full inline-block`}> 
                <div>{letter + number}</div>
                <Square piece={piece ? piece : null} squarePosition={{row: number, col: index2 + 1}}/>
              </span>
            })}
            </div>
        })}
      </div>
    </>
  )

}

export default Board