import { readFileSync } from 'fs'


export function read_input_file(day_number: number): string {
    return readFileSync(`./inputs/Day${day_number}.txt`, 'utf-8')
}

