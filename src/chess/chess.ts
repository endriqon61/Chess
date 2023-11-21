import { Piece, Position } from "./piece";
import Color from "../enums/player";

const globalPieces = ["r", "n", "b", "q", "k", "p"]

export class Chess {

// 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    public static getPieceByPosition(position: number[], board: Piece[]) {
       return board.find(p => [p.getPosition().row, p.getPosition().col].join() == position.join())
    }
    
    
    public static WhoInCheck(board: Piece[]): Color[] {

        const whiteKing = board.find(piece => piece.getTypePiece().toLocaleLowerCase() === "k" && piece.getColor() == Color.White)

        const blackKing = board.find(piece => piece.getTypePiece().toLocaleLowerCase() === "k" && piece.getColor() == Color.Black)

        const arr: Color[] = []

        board.forEach(p => p.calculateLegalMoves(board))
        for(let piece of board) {
            for(let pieceInVision of piece.getVision()) {
                if(piece.getColor() == Color.Black && JSON.stringify(whiteKing?.getPosition()) == JSON.stringify(pieceInVision)) {
                    // alert("Checked White")
                    arr.push(Color.White)
                }

                if(piece.getColor() == Color.White && JSON.stringify(blackKing?.getPosition()) == JSON.stringify(pieceInVision)) {
                    // alert("Checked Black")
                    arr.push(Color.Black)
                }
            }
        }


        return arr
    }

    public static parseFEN(fen: string): Piece[] {
        const positions = fen.split(" ")[0];
        const ranks = positions.split("/")

        const pieces: Piece[] = [];


        ranks.forEach((rank, rankIndex: number) => {

            let fileIndex = 0
            for(let piece of rank){
               if(piece.charCodeAt(0) >= 48 && piece.charCodeAt(0) <= 57)  {
                fileIndex += parseInt(piece)
                continue;
               }
               else if(piece.charCodeAt(0) >= 97 && piece.charCodeAt(0) <= 122 && globalPieces.includes(piece))  {
                pieces.push(new Piece({row: 8 - rankIndex, col: fileIndex + 1}, Color.Black, piece))      
               }
               else if(piece.charCodeAt(0) >= 65 && piece.charCodeAt(0) <= 90 && globalPieces.includes(piece.toLocaleLowerCase()))  {
                pieces.push(new Piece({row: 8 - rankIndex, col: fileIndex + 1}, Color.White, piece))      
               } else {
                throw Error("Invalid character in string");
               }
               fileIndex++

            }

        })

        

        return pieces

    }


}