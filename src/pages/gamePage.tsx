import Board from "./../components/Board"
import useGameState from "./../hooks/useGameState"
import Color from "./../enums/player"
import useSocket from "./../hooks/useSocket"
import { useEffect, useState } from "react"
import { socket } from "./../socket/socket"
import { APIgameState } from "./../types/api"
import {v4 as uuid} from "uuid"
import { createReference } from "./../components/Square"
import { BackendMoveData } from "./../types/api"
import { Piece } from "./../chess/piece"

export default function GamePage() {

  const { data } = useSocket<APIgameState>('chess:join-game')
  const { data: chessMove } = useSocket<BackendMoveData>(`chess:move`)
  const { gameState, setGameState } = useGameState()

  const joinGame = () => {
    const gameId = localStorage.getItem("gameId")
    const playerId = localStorage.getItem("playerId") || uuid()
    localStorage.setItem("playerId", playerId)
    if(gameId)
      socket.emit("chess:join-game", { gameId, playerId })
    else 
      socket.emit("chess:join-game", { gameId: null, playerId, gameState: gameState.board })
  }

  useEffect(() => {
    joinGame()
  }, [])

  const updateBoardState = (board: any[], isPlaying: Color) => {

          const newPieces = board.map(b => new Piece(b.position, b.color, b.typePiece))
          setGameState((prevState)=> ({...gameState, currentPiece: null, board: newPieces.map(i => createReference(i)), isPlaying: isPlaying}))
  }
  useEffect(() => {

      if(chessMove) {
        updateBoardState(chessMove.board, chessMove.isPlaying)
      }
      
  }, [chessMove])

  useEffect(() => {
      console.log("move, ", gameState.board)
  }, [gameState])


  const initializeGameStateAfterJoin = () => {

    if(data?.Game.id) {

      localStorage.setItem("gameId", data?.Game.id)

      console.log("join board", data.Game.board)


      if(localStorage.getItem("playerId")) {


        const currentPlayer = data.Game.players.find(p => p.id === localStorage.getItem("playerId"))

        if(!currentPlayer) throw Error("No PlayerId found")

        setGameState({...gameState, playerColor: currentPlayer.color})

      }

      if(data.Game.board)
        updateBoardState(data.Game.board, data.Game.isPlaying)
    }

    console.log("date join", data)
  }

  useEffect(() => {

    initializeGameStateAfterJoin()

  }, [data])


  return <>
    <div className="relative">
      <Board pieces={gameState.board} currentPlayerColor={Color.White} /> 
    </div>
  </>
}

