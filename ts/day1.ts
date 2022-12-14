import { readLines } from "./read.js"


class Elf {
    stash: number[]

    constructor(stash: number[]) {
        this.stash = stash
    }

    getTotalCalories(): number {
        return this.stash.reduce((cumsum, next) => cumsum + next)
    }
}

function getElvesFromInput(lines: string[]): Elf[] {
    let current_elf_stash: number[] = []
    let elves: Elf[] = []
    for (let calories of lines) {
        if (calories != '') { current_elf_stash.push(parseInt(calories)) }
        else {
            let elf = new Elf(current_elf_stash)
            elves.push(elf)
            current_elf_stash = []
        }
    }
    if (lines.at(-1) != '') {
        let elf = new Elf(current_elf_stash)
        elves.push(elf)
    }
    return elves
}


class groupHandler {
    group: Elf[]

    constructor(group: Elf[]) {
        this.group = group
    }

    getTopNCaloryElves(n_top: number): Elf[] {
        if (this.group.length <= n_top) {
            return this.group.sort(this.sortFunction)
        }
        let top_elves: Elf[] = this.group.slice(0, n_top).sort(this.sortFunction)
        for (let elf of this.group.slice(n_top)) {
            if (elf.getTotalCalories() >= top_elves[n_top - 1].getTotalCalories()) {
                top_elves.push(elf)
                top_elves.sort(this.sortFunction)
                top_elves = top_elves.slice(0, n_top)
            }
        }
        return top_elves
    }

    sortFunction(a: Elf, b: Elf): number {
        return b.getTotalCalories() - a.getTotalCalories()
    }
}


let elves = getElvesFromInput(readLines(1))
let handler = new groupHandler(elves)
let topElves = handler.getTopNCaloryElves(3)
let totalCalories: number = topElves.map(elf => elf.getTotalCalories()).reduce((a, b) => a + b, 0)
console.log(`Total calories across the top elves: ${totalCalories}`)
