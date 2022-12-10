import { readLines } from "./read.js"
import { transposeMatrix } from './day2.js'

class Forest {
    treeHeightsHorizontal: number[][]
    treeHeightsVertical: number[][]

    constructor(treeHeightsHorizontal: number[][]) {
        this.treeHeightsHorizontal = treeHeightsHorizontal
        this.treeHeightsVertical = transposeMatrix(treeHeightsHorizontal)
    }

    getVisibleTrees(): number[][] {
        let visibleTrees: number[][] = []
        for (let [UpDownIndex, LeftRightHrights] of this.treeHeightsHorizontal.entries()) {
            for (let [LeftRightIndex, height] of LeftRightHrights.entries()) {
                if (this.isTreeVisible(UpDownIndex, LeftRightIndex)) {
                    visibleTrees.push([UpDownIndex, LeftRightIndex])
                }
            }
        }
        return visibleTrees
    }

    getHighestScore(): number {
        let bestScore: number = 0
        let bestScoreIndex: number[] = [-1, -1]
        for (let [UpDownIndex, LeftRightHrights] of this.treeHeightsHorizontal.entries()) {
            for (let [LeftRightIndex, height] of LeftRightHrights.entries()) {
                let scores = this.getTreeViewDistances(UpDownIndex, LeftRightIndex)
                let totalScore = scores.reduce((acumulator, next) => acumulator * next, 1)
                if (totalScore > bestScore) {
                    bestScore = totalScore
                    bestScoreIndex = [UpDownIndex, LeftRightIndex]
                }
            }
        }
        return bestScore
    }

    isTreeVisible(UpDownIndex: number, LeftRightIndex: number): boolean {
        let heightsLeftRight = this.treeHeightsHorizontal[UpDownIndex]
        let heightsUpDown = this.treeHeightsVertical[LeftRightIndex]
        let visibleLeftRight = this.isTreeVisibleInDirection(heightsLeftRight, LeftRightIndex)
        let visibleUpDown = this.isTreeVisibleInDirection(heightsUpDown, UpDownIndex)
        return visibleLeftRight || visibleUpDown
    }

    isTreeVisibleInDirection(heightsInDirection: number[], treePosition: number): boolean {
        let [isVisibleBefore, isvisibleAfter] = [true, true]
        let treeHeight = heightsInDirection[treePosition]
        for (let height of heightsInDirection.slice(0, treePosition)) {
            if (height >= treeHeight) {
                isVisibleBefore = false
                break
            }
        }
        for (let height of heightsInDirection.slice(treePosition + 1)) {
            if (height >= treeHeight) {
                isvisibleAfter = false
                break
            }
        }
        return isVisibleBefore || isvisibleAfter
    }

    getTreeViewDistances(UpDownIndex: number, LeftRightIndex: number): number[] {
        let heightsLeftRight = this.treeHeightsHorizontal[UpDownIndex]
        let heightsUpDown = this.treeHeightsVertical[LeftRightIndex]
        let treeHeight = heightsLeftRight[LeftRightIndex]
        let leftScore = this.getViewDistance(treeHeight, heightsLeftRight.slice(0, LeftRightIndex).reverse())
        let rightScore = this.getViewDistance(treeHeight, heightsLeftRight.slice(LeftRightIndex + 1))
        let upScore = this.getViewDistance(treeHeight, heightsUpDown.slice(0, UpDownIndex).reverse())
        let downScore = this.getViewDistance(treeHeight, heightsUpDown.slice(UpDownIndex + 1))
        return [leftScore, rightScore, upScore, downScore]
    }

    getViewDistance(treeHeight: number, otherHeights: number[]): number {
        let distance: number = 0
        for (let height of otherHeights) {
            distance += 1
            if (height >= treeHeight) { break }
        }
        return distance
    }
}

let lines: string[] = readLines(8)
let forest: Forest = new Forest(lines.map(str => str.split('').map(x => parseInt(x))))
let visibleTrees: number[][] = forest.getVisibleTrees()
console.log(`Number fully visible trees: ${visibleTrees.length}`)
console.log(`Best tree score: ${forest.getHighestScore()}`)