import Color from "../enums/player"
import { Position } from "../chess/piece"

type APIgameState = {
    board: unknown[],
    isPlaying: Color,
    Game: Game
}
type Player = {
  id: string,
  username: string,
  color: Color
}

type Game = {
  id: string,
  players: Player[],
  board: unknown[],
  isPlaying: Color
}

type backendPiece = {
    color: Color,
    position: Position,
    typePiece: string
}

type BackendMoveData = {
    board: backendPiece[]
    isPlaying: Color
}

export type { Game, APIgameState, Player, BackendMoveData }