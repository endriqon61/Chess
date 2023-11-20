import Color from "../enums/player";
import { Chess } from "./chess";

export interface Position {
    row: number,
    col: number
}

const KNIGHT_MOVES: number[][] = [
    [-2, 1], [-1, 2], [1, 2], [2, 1],
    [2, -1], [1, -2], [-1, -2], [-2, -1]
];

const STRAIGHT_DIRECTIONS = [[1, 0], [0, 1], [-1, 0], [0, -1]]
const DIAGONAL_DIRECTIONS = [[1, 1], [-1, 1], [1, -1], [-1, -1]]


export class Piece {

    private position: Position;
    private readonly color: Color;
    private typePiece: string;
    private legalMoves: number[][];
    private vision: Position[];

    constructor(startingPos: Position, _color: Color, _piece: string) {
        this.position = startingPos;
        this.color = _color;
        this.typePiece = _piece;
        this.legalMoves = []
        this.vision = []
    }

    calculateLegalMoves(board: Piece[]): void {

        let legalMoves: number[][] = []

        if(this.typePiece.toLocaleLowerCase() == "n") {
            legalMoves = KNIGHT_MOVES
        }

        else if(this.typePiece.toLocaleLowerCase() == "p") {
            legalMoves = this.addPawnMoves(board)
        } else if(this.typePiece.toLocaleLowerCase() == "q") {
            legalMoves = this.addMovesToDirections(board, STRAIGHT_DIRECTIONS.concat(DIAGONAL_DIRECTIONS))
        } else if (this.typePiece.toLocaleLowerCase() == "b") {
            legalMoves = this.addMovesToDirections(board, DIAGONAL_DIRECTIONS)
        } else if (this.typePiece.toLocaleLowerCase() == "r") {
            legalMoves = this.addMovesToDirections(board, STRAIGHT_DIRECTIONS)
        } else if (this.typePiece.toLocaleLowerCase() == "k") {
            legalMoves = STRAIGHT_DIRECTIONS.concat(DIAGONAL_DIRECTIONS)
        } else {
            throw new Error("Invalid piece")
        }

        // this.calculateVision(board)
        const newLegalMoves = legalMoves.filter(move => Chess.getPieceByPosition([this.position.row + move[0], this.position.col + move[1]], board)?.getColor() != this.color).map(move => [this.position.row + move[0], this.position.col + move[1]])
        this.legalMoves = newLegalMoves  

        this.vision = []
        for(let move of newLegalMoves) {

            // const visiblePiece = Chess.getPieceByPosition([this.position.row + move[0], this.position.col + move[1]], board)

            const visiblePiece = Chess.getPieceByPosition([move[0], move[1]], board)

            if(visiblePiece && visiblePiece.getColor() != this.color) {
                if(visiblePiece)
                    this.vision.push(visiblePiece.getPosition())
            }
        }
       
    }

    public filterCheckMoves(board: Piece[]) {

        this.legalMoves = [...this.legalMoves.filter(move => {

            const position = {row: move[0], col: move[1]}
            const newPieces = this.moveTo(position, board)
            newPieces.forEach(p => p.calculateLegalMoves(newPieces))

            const check = Chess.WhoInCheck(newPieces) 

            console.log("Check: ", check)

            return !check.includes(this.color)

        })]
    }
    
    private addMovesToDirections(board: Piece[], directions: number[][]): number[][] {

        const legalMoves: number[][] = []

        for(let direction of directions) {
            let isValidSquare = true
            let moveToAdd = [0, 0]
            while(isValidSquare) {
                const newMovesToAdd = [...moveToAdd]
                newMovesToAdd[0] += direction[0]
                newMovesToAdd[1] += direction[1]
                moveToAdd = [...newMovesToAdd]
                const nextPosition = [this.position.row + moveToAdd[0], this.position.col + moveToAdd[1]]
                const adjPiece = Chess.getPieceByPosition(nextPosition, board)  
                if(adjPiece || (nextPosition[0] > 8 || nextPosition[1] < 0 || nextPosition[0] < 0 || nextPosition[1] > 8)) isValidSquare = false
                legalMoves.push(newMovesToAdd)
            }
        }
        return legalMoves
    }
    
    private addPawnMoves(board: Piece[]) {

       const sign = this.color == Color.White ? 1 : -1  
       const moves = [[1,-1], [1, 0], [2, 0], [1,1]].map(i => i.map(x => x * sign)) 
       if((this.position.row != 7 && this.position.row != 2) || Chess.getPieceByPosition([this.position.row + moves[2][0], this.position.col + moves[2][1]], board)) {
        moves[2] = []
       }

       if(Chess.getPieceByPosition([this.position.row + moves[1][0], this.position.col + moves[1][1]], board)){
        moves[1] = []
        moves[2] = []
       }

       if(!Chess.getPieceByPosition([this.position.row + moves[0][0], this.position.col + moves[0][1]], board)){
        moves[0] = []
       }
       if(!Chess.getPieceByPosition([this.position.row + moves[3][0], this.position.col + moves[3][1]], board)){
        moves[3] = []
       }
       return moves.filter(m => m)
    }

    private createReference(obj: Piece) {
    const reference = new  Piece({row: 0, col: 0}, Color.White, "p")
    Object.assign(reference, obj);
    return reference;
    }

    moveTo(ToSquare: Position, board: Piece[]) {

        const newPieces = board.map(i => this.createReference(i))

        newPieces.forEach((item: Piece, index: number) => {
            if(JSON.stringify(item.getPosition()) == JSON.stringify(ToSquare)) {
                return newPieces.splice(index, 1)
            }
        })

        newPieces.forEach((item: Piece) => {
            if(JSON.stringify(item.getPosition()) == JSON.stringify(this?.getPosition()))  {
                item.setPosition(ToSquare)
            }
        })


        return newPieces
    }

    getVision(): Position[] {
        return this.vision
    }
    getLegalMoves(): number[][] {
        return this.legalMoves
    }

    getPosition(): Position {
        return this.position
    }

    setPosition(newPosition: Position): void {
        this.position = newPosition
    }

    getTypePiece(): string {
        return this.typePiece
    }

    getColor(): Color {
        return this.color
    }
    

}


// export class Pawn extends Piece {


//     constructor(startingPos: pos, color: string) {
//         super(startingPos, color) 
//         if(color == "W") this.sprite = "P"
//         else this.sprite = "p"
//     }
    
// }