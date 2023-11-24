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

interface SlidingVector  {
    piecePosition: number[],
    kingPosition: number[]
    betweenPieces: Piece[]
}


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

        this.legalMoves = legalMoves.filter(move => Chess.getPieceByPosition([this.position.row + move[0], this.position.col + move[1]], board)?.getColor() != this.color).map(move => [this.position.row + move[0], this.position.col + move[1]])
        .filter(m => {

                return !(m[0] > 8 || m[1] < 1 || m[0] < 1 || m[1] > 8)
        })

        // this.calculateVision(newLegalMoves, board)
       
    }

    private calculateVision(legalMoves: number[][], board: Piece[]) {

        this.vision = []

        for(let move of legalMoves) {

            const visiblePiece = Chess.getPieceByPosition([move[0], move[1]], board)

            if(visiblePiece && visiblePiece.getColor() != this.color) {
                if(visiblePiece)
                    this.vision.push(visiblePiece.getPosition())
            }
        }
    }

    private isInVector(pos1: number[], pos2: number[]) {
        const piecePos = [this.position.row, this.position.col]
        const smallerX = pos1[0] > pos2[0] ? pos2[0] : pos1[0]
        const smallerY = pos1[1] > pos2[1] ? pos2[1] : pos1[1]
        const biggerX = pos1[0] < pos2[0] ? pos2[0] : pos1[0]
        const biggerY = pos1[1] < pos2[1] ? pos2[1] : pos1[1]

        return  piecePos[0] - piecePos[1] == pos1[0] - pos1[1]
        && ((piecePos[0] > smallerX && piecePos[0] < biggerX) && (piecePos[1] > smallerY && piecePos[1] < biggerY))
    }

    public isSlidingPiece(typePiece: string) {
        return typePiece && (typePiece.toLowerCase() == "b" || typePiece.toLowerCase() == "q" || typePiece.toLowerCase() == "r")
    }

    public filterCheckMoves(board: Piece[]) {

        let isPlaying = Color.Black

        const slidingVectors: SlidingVector[] = []
        // if(Math.random() * 2  == 1) isPlaying = Color.Black;

        for(const p of board) p.calculateLegalMoves(board)

        const check = Chess.WhoInCheck(board) 

        const king = board.find(p => p.typePiece.toLocaleLowerCase() == "k" && p.getColor() == isPlaying)

        const kingPosition = Object.values(king!.getPosition())

        //move is an array [row(1-8), col(1-8)]
        const squaresUnderAttack: number[][] = []
        const vectors: number[][] = [] 
        for(const p of board.filter(p => p.getColor() != isPlaying)) {
             p.getLegalMoves().map(m => squaresUnderAttack.push(m))
             if(p.getTypePiece().toLocaleLowerCase() == "b") {
                const piecePosition = [p.position.row, p.position.col] 
                if(p.getTypePiece().toLocaleLowerCase() == "b") {
                   if(piecePosition[0] - piecePosition[1] == kingPosition[0] - kingPosition[1])  {
                    slidingVectors.push({piecePosition: piecePosition, kingPosition: kingPosition, betweenPieces: []})
                   }
                }
             }
        }

        for(const vector of slidingVectors) {
            vector.betweenPieces = board.filter(p => {
                return p.isInVector(vector.kingPosition, vector.piecePosition)
            })
        }


        console.log("vectors", slidingVectors)

        this.legalMoves = [...this.legalMoves.filter(move => {
            //block king moves that are currently attacked by opposite colors
            
            //find opposite color sliding piece vectors
            if(this.typePiece.toLocaleLowerCase() == "k") {
                return !squaresUnderAttack.some(s => s.join() == [move[0], move[1]].join())
            }

            const vector = slidingVectors.find(v => v.betweenPieces.some(p => [p.getPosition().row, p.getPosition().col].join() == [this.position.row, this.position.col].join()))
            //check if piece is pinned it cannot move outside the sliding piece and king vector
            if(vector) return false


            if(check.includes(isPlaying)) {

                //if sliding piece is checking only legal moves are king moves or blocking the check


                //if pawn or knight is checking only legal moves are king moves or capturing the piece


                //double check logic goes here
            } 


            return true
        })]
        //TODO Pins
        //TODO King Moves

        //TODO Captures

        // this.legalMoves = [...this.legalMoves.filter(move => {

        //     const position = {row: move[0], col: move[1]}

        //     const newPieces = this.moveTo(position, board)

        //     // newPieces.forEach(p => p.calculateLegalMoves(newPieces))

        //     console.time("Check")
        //     const check = Chess.WhoInCheck(newPieces) 
        //     console.timeEnd("Check")


        //     return !check.includes(this.color)

        // })]
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
                if(adjPiece || (nextPosition[0] > 8 || nextPosition[1] < 1 || nextPosition[0] < 1 || nextPosition[1] > 8)) isValidSquare = false
                if(isValidSquare || (adjPiece && adjPiece?.getColor() != this.color))
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

        console.time("MoveTo")
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


        console.timeEnd("MoveTo")
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