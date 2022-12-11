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

class Snake {
    headPosition: Position = new Position(0, 0)
    tailPosition: Position = new Position(0, 0)
    visitedTailPositions: Position[] = []

    runInput(inputLines: string[]) {
        for (let line of inputLines) {
            let split = line.split(' ')
            if (split.length != 2) {
                throw `Got a line dont know how to parse: ${line}`
            }
            let direction: string = split[0]
            let nSteps: number = parseInt(split[1])
            for (let i = 0; i < nSteps; i++) {
                this.move(direction)
            }
        }
    }

    move(direction: string) {
        this.moveHead(direction)
        this.updateTailPosition()
        this.updateVisitedTailPositions()
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

    moveHead(direction: string) {
        this.headPosition.move(inputMapping[direction])
    }

    updateTailPosition() {
        let headTailDistance = this.headPosition.getDistanceFrom(this.tailPosition)
        let baseXMovement: number
        let baseYMovement: number
        switch (headTailDistance.getModulo()) {
            case 5: {//move diagonally
                baseXMovement = 1
                baseYMovement = 1
                break
            }
            case 4: {// move horizontally/vertically
                baseXMovement = headTailDistance.deltaX == 0 ? 0 : 1
                baseYMovement = headTailDistance.deltaY == 0 ? 0 : 1
                break
            }
            default: return
        }
        let xMove: number = baseXMovement * Math.sign(headTailDistance.deltaX)
        let yMove: number = baseYMovement * Math.sign(headTailDistance.deltaY)
        this.tailPosition.move(new Distance(xMove, yMove))
    }
}

let snake = new Snake()
let lines: string[] = readLines(9)
snake.runInput(lines)
console.log(`Tail visited ${snake.visitedTailPositions.length} unique positions`)

let x = 5
let y = 6