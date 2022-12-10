import { readLines, readInputFile } from "./read.js"

class StateMachine {
    isRepeated: boolean
    charInWindow: string[]
    counter: { [char: string]: number }
    windowSize: number
    duplicatedElements: Set<string>

    constructor(windowSize: number) {
        this.isRepeated = false
        this.charInWindow = []
        this.counter = {}
        this.windowSize = windowSize
        this.duplicatedElements = new Set()
    }

    addElement(charIn: string) {
        if (this.charInWindow.length == this.windowSize) {
            let charOut = this.charInWindow.shift()
            if (charOut == null) {
                throw `Tried to pop from an empty list`
            }
            this.counter[charOut] -= 1
            if (this.duplicatedElements.has(charOut) && this.counter[charOut] == 1) {
                this.duplicatedElements.delete(charOut)
            }
        }
        this.charInWindow.push(charIn)
        this.counter[charIn] = (this.counter[charIn] || 0) + 1
        if (this.counter[charIn] > 1) { this.duplicatedElements.add(charIn) }

        if (this.duplicatedElements.size == 0) {
            this.isRepeated = false
        } else { this.isRepeated = true }
    }

    parseStreamUntilStop(stream: string): number {
        for (let idx = 0; idx < stream.length; idx++) {
            this.addElement(stream[idx])
            if (this.stop()) { return idx + 1 }
        }
        return -1
    }

    stop(): boolean {
        return !this.isRepeated && this.charInWindow.length == this.windowSize
    }

}

let startPacketFinder = new StateMachine(4)
let startMessageFinder = new StateMachine(14)
let stream = readInputFile(6)

console.log(`Start of packet at position ${startPacketFinder.parseStreamUntilStop(stream)}`)
console.log(`Start of message at position ${startMessageFinder.parseStreamUntilStop(stream)}`)