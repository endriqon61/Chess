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

    private static moveIsInVector(kingPosition: Position, checkPiece: Piece, move: number[]) {

        const checkPiecePosition = checkPiece.getPosition()
        const isInDiagonal = move[0] - move[1] == checkPiecePosition.row - checkPiecePosition.col
        const isInVerticalLine = move[1] == checkPiecePosition.col;
        const isInHorizontalLine = move[0] == checkPiecePosition.row;




    }


    private static CanBlockCheck(board: Piece[], isPlaying: Color, check: Check, accessProp: "blackCheckedByPieces" | "whiteCheckedByPieces") {

        if(check[accessProp].length > 1)
            return false;


        // const check = Chess.WhoInCheck(board) 

        const king = board.find(p => p.getTypePiece().toLocaleLowerCase() == "k" && p.getColor() != isPlaying)
        const kingPosition = Object.values(king!.getPosition())
        const pieceChecking = check[accessProp][0]

        
        let isBlockable = false        

        

        


       

    }

    public static isMate(board: Piece[], isPlaying: Color, check: Check): boolean {

        const king = board.find(p => p.getTypePiece().toLocaleLowerCase() == "k" && p.getColor() != isPlaying)
        king?.calculateLegalMoves(board)
        king?.filterCheckMoves(board)

        const kingHasLegalMoves = king?.getLegalMoves()?.length! > 0

        const accessProp = isPlaying == Color.White ? "blackCheckedByPieces" : "whiteCheckedByPieces";

        let canBlockCheck = true

        let canCapturePieces = true
        
        




        return !canCapturePieces && !canBlockCheck && !kingHasLegalMoves;
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

            if(piece.getVision().find(v => JSON.stringify(v) ==  JSON.stringify(whiteKing?.getPosition()))) {
                check.whiteCheckedByPieces.push(piece)
            }

            if(piece.getVision().find(v => JSON.stringify(v) ==  JSON.stringify(blackKing?.getPosition()))) {
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