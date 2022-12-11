import { readLines } from "./read.js"

class Position {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    getDistanceFrom(otherPosition: Position): Distance {
        return new Distance(this.x - otherPosition.x, this.y - otherPosition.y)
    }

    move(amount: Distance) {
        this.x += amount.deltaX
        this.y += amount.deltaY
    }
}

class Distance {
    deltaX: number
    deltaY: number

    constructor(deltaX: number, deltaY: number) {
        this.deltaX = deltaX
        this.deltaY = deltaY
    }

    getModulo(): number {
        return this.deltaX ** 2 + this.deltaY ** 2
    }
}

const inputMapping: { [direction: string]: Distance } = {
    'U': new Distance(0, 1),
    'D': new Distance(0, -1),
    'L': new Distance(-1, 0),
    'R': new Distance(1, 0)
}

class KnotPair {
    headPosition: Position
    tailPosition: Position
    visitedTailPositions: Position[] = []

    constructor(headPosition: Position, tailPosition: Position) {
        this.headPosition = headPosition
        this.tailPosition = tailPosition
    }

    updateVisitedTailPositions() {
        let alreadyVisited: boolean = false
        for (let visitedPosition of this.visitedTailPositions) {
            if (visitedPosition.x == this.tailPosition.x && visitedPosition.y == this.tailPosition.y) {
                alreadyVisited = true
                break
            }
        }
        if (!alreadyVisited) { this.visitedTailPositions.push(structuredClone(this.tailPosition)) }
    }

    updateTailPosition() {
        let headTailDistance = this.headPosition.getDistanceFrom(this.tailPosition)
        let baseXMovement: number
        let baseYMovement: number

        let distanceModulo: number = headTailDistance.getModulo()
        if (distanceModulo >= 5) {
            //move diagonally
            baseXMovement = 1
            baseYMovement = 1
        } else if (distanceModulo == 4) {
            // move horizontally/vertically
            baseXMovement = headTailDistance.deltaX == 0 ? 0 : 1
            baseYMovement = headTailDistance.deltaY == 0 ? 0 : 1
        } else {
            baseXMovement = 0
            baseYMovement = 0
        }
        let xMove: number = baseXMovement * Math.sign(headTailDistance.deltaX)
        let yMove: number = baseYMovement * Math.sign(headTailDistance.deltaY)
        this.tailPosition.move(new Distance(xMove, yMove))
        this.updateVisitedTailPositions()
    }
}


class KnotsChain {
    knotPairs: KnotPair[]

    constructor(chainKnotLength: number) {
        let numberPairs: number = chainKnotLength - 1
        if (numberPairs < 1) {
            throw `Cannot create a knot chain of less than 2 knows. Got: ${chainKnotLength}`
        }
        this.knotPairs = []
        this.initializeChainPairs(numberPairs)
    }

    initializeChainPairs(numberPairs: number) {
        let masterHeadPosition = new Position(0, 0)
        let linkAheadPosition = new Position(0, 0)
        let firstPair = new KnotPair(masterHeadPosition, linkAheadPosition)
        this.knotPairs.push(firstPair)

        for (let i = 1; i < numberPairs; i++) {
            let linkBehindPosition = new Position(0, 0)
            let nextPair = new KnotPair(linkAheadPosition, linkBehindPosition)
            this.knotPairs.push(nextPair)
            linkAheadPosition = linkBehindPosition

        }
    }

    moveHeadAndUpdateTails(direction: string) {
        this.knotPairs[0].headPosition.move(inputMapping[direction])
        for (let pair of this.knotPairs) {
            pair.updateTailPosition()
        }
    }

    runInput(inputLines: string[]) {
        for (let line of inputLines) {
            let split = line.split(' ');
            if (split.length != 2) {
                throw `Got a line dont know how to parse: ${line}`;
            }
            let direction = split[0];
            let nSteps = parseInt(split[1]);
            for (let i = 0; i < nSteps; i++) {
                this.moveHeadAndUpdateTails(direction);
            }
        }
    }

}

let chainShort = new KnotsChain(2)
let chainLong = new KnotsChain(10)
let lines: string[] = readLines(9)
chainShort.runInput(lines)
chainLong.runInput(lines)
console.log(`Tail of short chain visited ${chainShort.knotPairs[chainShort.knotPairs.length - 1].visitedTailPositions.length} unique positions`)
console.log(`Tail of long chain visited ${chainLong.knotPairs[chainLong.knotPairs.length - 1].visitedTailPositions.length} unique positions`)