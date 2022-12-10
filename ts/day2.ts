enum Result {
    Lose = -1,
    Draw = 0,
    Win = 1,
}

enum Move {
    Rock = 0,
    Paper = 1,
    Scissor = 2
}

let inputMoveMapping = {
    A: Move.Rock,
    B: Move.Paper,
    C: Move.Scissor
}

let inputResultMapping = {
    X: Result.Lose,
    Y: Result.Draw,
    Z: Result.Win
}


export function transposeMatrix(matrix: Result[][]): Result[][] {
    let n_cols = matrix[0].length
    let transposedMatrix: Result[][] = Array.from(Array(n_cols), _ => [])
    for (let row of matrix) {
        for (let [col_idx, value] of row.entries()) {
            transposedMatrix[col_idx].push(value)
        }
    }
    return transposedMatrix
}

let victoryMatrix: Result[][] = [[Result.Draw, Result.Lose, Result.Win], [Result.Win, Result.Draw, Result.Lose], [Result.Lose, Result.Win, Result.Draw]]


class matchSimulator {

    victoryMatrixTransposed = transposeMatrix(victoryMatrix)


    getOurMoveToAchieveResult(oppMove: Move, targetResult: Result): string {
        let results = this.victoryMatrixTransposed[oppMove]
        let idx = results.indexOf(targetResult)
        return Move[idx]
    }
}
