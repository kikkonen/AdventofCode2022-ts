import { readFileSync } from 'fs'


export function readInputFile(day_number: number): string {
    return readFileSync(`./inputs/Day${day_number}.txt`, 'utf-8')
}

export function readLines(day_number: number): string[] {
    let contents = readInputFile(day_number)
    return contents.split('\r\n')
}
