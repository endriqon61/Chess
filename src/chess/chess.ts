import { Piece, Position } from "./piece";
import Color from "../enums/player";

const globalPieces = ["r", "n", "b", "q", "k", "p"]

export interface Check {
    blackCheckedByPieces: Piece[] 
    whiteCheckedByPieces: Piece[] 
}

export class Chess {

// 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    public static getPieceByPosition(position: number[], board: Piece[]) {
       return board.find(p => [p.getPosition().row, p.getPosition().col].join() == position.join())
    }

    private static distance(A: number[], B: number[]) {
        return Math.abs(A[0] - B[0]) + Math.abs(A[1] - B[1])
    }

    private static moveIsInVector(kingPosition: Position, checkPiece: Piece, move: number[]) {

        const checkPiecePosition = checkPiece.getPosition()

        // const isInDiagonal = move[0] - move[1] == checkPiecePosition.row - checkPiecePosition.col && move[0] - move[1] == kingPosition.row - kingPosition.col

        // const isInVerticalLine = move[1] == checkPiecePosition.col && move[1] == kingPosition.col;

        // const isInHorizontalLine = move[0] == checkPiecePosition.row  && move[1] == kingPosition.col;

        return this.distance([kingPosition.row, kingPosition.col], [move[0], move[1]])  + this.distance([move[0], move[1]], [checkPiecePosition.row, checkPiecePosition.col]) == this.distance([kingPosition.row, kingPosition.col], [checkPiecePosition.row, checkPiecePosition.col])

    }

    private static isPiecePinned(piece: Piece, board: Piece[]) {

    }

    private static CanBlockCheck(board: Piece[], isPlaying: Color, check: Check, accessProp: "blackCheckedByPieces" | "whiteCheckedByPieces") {

        if(check[accessProp].length > 1)
            return false;


        // const check = Chess.WhoInCheck(board) 

        const king = board.find(p => p.getTypePiece().toLocaleLowerCase() == "k" && p.getColor() != isPlaying)
        const kingPosition = Object.values(king!.getPosition())
        const pieceChecking = check[accessProp][0]

        
        let isBlockable = false        
        for(let piece of board) {
           for(let move of piece.getLegalMoves()) {
                if(this.moveIsInVector(king!.getPosition(), pieceChecking, move))
                    isBlockable = true
                // if(kingPosition.join() == move.join()) 
                //     isBlockable = true
           } 
        }

        return isBlockable
    }

    public static isMate(board: Piece[], isPlaying: Color, check: Check): boolean {
        return !board.filter(p => p.getColor() != isPlaying).some(p => {
            p.filterCheckMoves(board)
            return p.getLegalMoves().length > 0
        })
    }
    
    public static WhoInCheck(board: Piece[]): Check | null {

        const whiteKing = board.find(piece => piece.getTypePiece().toLocaleLowerCase() === "k" && piece.getColor() == Color.White)
        const blackKing = board.find(piece => piece.getTypePiece().toLocaleLowerCase() === "k" && piece.getColor() == Color.Black)

        let check: Check = {
            whiteCheckedByPieces: [],
            blackCheckedByPieces: []
        };

        board.forEach(p => p.calculateLegalMoves(board))
        for(let piece of board) {

            if(piece.getLegalMoves().find(v => v.join() ==  [whiteKing?.getPosition().row, whiteKing?.getPosition().col].join())) {
                check.whiteCheckedByPieces.push(piece)
            }

            if(piece.getLegalMoves().find(v => v.join() ==  [blackKing?.getPosition().row, blackKing?.getPosition().col].join())) {
                check.blackCheckedByPieces.push(piece)
            }

        }


        return check
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