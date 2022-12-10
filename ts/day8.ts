import { readLines } from "./read.js"
import { transposeMatrix } from './day2.js'

class Forest {
    treeHeightsHorizontal: number[][]
    treeHeightsVertical: number[][]

    constructor(treeHeightsHorizontal: number[][]) {
        this.treeHeightsHorizontal = treeHeightsHorizontal
        this.treeHeightsVertical = transposeMatrix(treeHeightsHorizontal)
    }

    isTreeVisibleInDirection(heightsInDirection: number[], treePosition: number): boolean {
        let isVisible: boolean = true
        let treeHeight = heightsInDirection[treePosition]
        for (let height of heightsInDirection.slice(0, treePosition)) {
            if (height >= treeHeight) {
                isVisible = false
                break
            }
        }
        if (isVisible == false) { return isVisible }
        for (let height of heightsInDirection.slice(treePosition + 1)) {
            if (height >= treeHeight) {
                isVisible = false
                break
            }
        }
        return isVisible
    }
}

let lines: string[] = readLines(8)
let forest: Forest = new Forest(lines.map(str => str.split('').map(x => parseInt(x))))
