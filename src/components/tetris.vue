<script setup>
import { onMounted } from 'vue'



class Tetris {
  constructor() {
    this._board = new Array(20).fill(this.getRow())
    this.init()
    this.createMoveBoard()
  }

  getRow(row = []) {
    const arr = new Array(10).fill(0).map((_, i) => +row.includes(i) && 1)
    return '0b' + arr.join('')
    // return +('0b' + arr.join(''))
  }

  init() {
    const diamonds = [
      {
        matrix: [
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0]
        ]
      },
      {
        matrix: [
          [1, 1],
          [1, 1]
        ]
      },
      {
        matrix: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0]
        ]
      },
      {
        matrix: [
          [0, 1, 1],
          [1, 1, 0],
          [0, 0, 0]
        ]
      },
      {
        matrix: [
          [1, 1, 0],
          [0, 1, 1],
          [0, 0, 0]
        ]
      },
      {
        matrix: [
          [1, 0, 0],
          [1, 1, 1],
          [0, 0, 0]
        ]
      },
      {
        matrix: [
          [0, 0, 1],
          [1, 1, 1],
          [0, 0, 0]
        ]
      },
    ]
    diamonds.forEach(diamond => {
      const size = diamond.matrix.length
      const board = new Array(20).fill(this.getRow())

      diamond.matrix.forEach((row, i) => {
        const ix = Math.floor((10 - size) / 2)
        board[i] = this.getRow(row.map((m, n) => m * (n + ix)).filter(Boolean))
      })

      diamond.size = size
      diamond.defaultBoard = board
    })
    this._diamonds = diamonds
  }
  getRandomDiamond() {
    const len = this._diamonds.length
    const index = Math.floor(Math.random() * len)
    return this._diamonds[index]
  }

  createMoveBoard() {
    const { defaultBoard, size } = this.getRandomDiamond()
    this._moveBoard = defaultBoard
    this._diamondSize = size
    this._moveBoard2 = this._moveBoard.map(i => i)
    this._moveBoard3 = this._moveBoard.map(i => +i)
  }

  spin() {
    const len = this._diamondSize
    console.log('😠', len)
    const _spin = ([i, j]) => [len - j - 1, i]
  }
  leftMove(reject) {
    const isVoid = (Math.max(...this._moveBoard) ^ this.getRow([0])) === 0
    if (isVoid) {
      reject()
      return;
    }
    this._moveBoard = this._moveBoard.map(i => i && (i << 1))
  }
  rightMove(reject) {
    const isVoid = (Math.min(...this._moveBoard.filter(Boolean)) & 1) !== 0
    if (isVoid) {
      reject()
      return;
    }
    this._moveBoard = this._moveBoard.map(i => i && (i >> 1))
  }
  downMove(reject) {
    const i = this._moveBoard.findLastIndex(Boolean)
    const isVoid = (this._moveBoard[i] & this._board[i + 1]) !== 0
    if (isVoid) {
      reject()
      return;
    }
    this._moveBoard = [0, ...this._moveBoard.slice(0, -1)]
  }
}



const tetris = new Tetris()
onMounted(() => {
  tetris.leftMove()
  // tetris.rightMove()
  tetris.downMove()
  tetris.spin()
  console.log('😓', tetris)
})
</script>

<template>

</template>

<style scoped></style>
