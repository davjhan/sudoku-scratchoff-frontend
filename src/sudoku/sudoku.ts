import {writable} from 'svelte/store'

export const emptySudoku = Array(9).fill(null)
    .map((_, r) =>
        Array(9).fill(null).map((_, c) => {
            return {
                shownValue: 0,
                hiddenValue: 9,
                owner: null
            }
        })
    )
const filledSudoku = [
    [7, 4, 2, 5, 6, 1, 3, 9, 8],
    [9, 5, 8, 3, 2, 4, 1, 6, 7],
    [3, 1, 6, 8, 9, 7, 4, 2, 5],
    [5, 3, 4, 2, 7, 6, 9, 8, 1],
    [2, 8, 7, 9, 1, 3, 6, 5, 4],
    [6, 9, 1, 4, 5, 8, 7, 3, 2],
    [8, 6, 5, 7, 4, 9, 2, 1, 3],
    [1, 7, 3, 6, 8, 2, 5, 4, 9],
    [4, 2, 9, 1, 3, 5, 8, 7, 6]
]

export const session = function () {
    const data = {
        name: 'david'
    }
    const {subscribe, set, update} = writable(data)

    return {
        subscribe: subscribe,
    }
}()
// export const sudoku = function () {
//     const sudokuBoard = Array(9).fill(null)
//         .map((_, r) =>
//             Array(9).fill(null).map((_, c) => {
//                 return {
//                     shown: -1,
//                     answer: filledSudoku[r][c],
//                     owner: undefined
//                 }
//             })
//         )
//     console.log(`board`, sudokuBoard)
//     const data: any = {
//         board: sudokuBoard,
//         scores: {
//             'david': {
//                 name: 'David',
//                 score: 0
//             }
//         },
//         turn: 'david'
//     }
//     const {subscribe, set, update} = writable(data)
//
//     function reveal(r: number, c: number) {
//         update(it => {
//             if(it.board[r][c].shown !== -1) return it
//             it.board[r][c].shown = it.board[r][c].answer
//             it.scores[it.turn].score += it.board[r][c].answer
//             return it
//         })
//     }
//
//     return {
//         subscribe: subscribe,
//         reveal: reveal
//     }
// }()