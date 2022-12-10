import { readLines } from "./read.js";

let lines: string[] = readLines(3)

function findRepeatedElementPerLine(lines: string[]): string[] {
    let repeatedElements: string[] = []
    for (let line of lines) {
        let lineLength = line.length
        if (lineLength % 2 != 0) {
            throw `Expected even number of characters. Got ${lineLength}: ${line}`
        }
        let set1 = new Set(line.slice(0, lineLength / 2))
        let set2 = new Set(line.slice(lineLength / 2))
        let overlap = new Set([...set1].filter(a => set2.has(a)))
        if (overlap.size != 1) {
            throw `Expected one overlap per line, found ${overlap.size}: ${overlap}`
        }
        repeatedElements.push([...overlap][0])
    }
    return repeatedElements
}

console.log(findRepeatedElementPerLine(readLines(3)))