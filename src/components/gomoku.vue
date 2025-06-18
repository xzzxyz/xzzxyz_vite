<script setup>
import { onMounted, ref, watch } from "vue";
import $, { fn } from "jquery";


class Gomoku {
  constructor(size = 25) {
    this._size = size
    this._board = new Array(size).fill(0).map(() => new Array(size).fill(0))
    this._lastX = 0
    this._lastY = 0
  }

  get lastData() {
    return {
      x: this._lastX,
      y: this._lastY,
      value: this._board[this._lastX][this._lastY]
    }
  }


  setPiece(x, y, value, fn = () => { }) {
    if (x < 0 || x >= this._size || y < 0 || y >= this._size) {
      return
    }
    if (this._board[x][y] === 0) {
      this._board[x][y] = value
      this._lastX = x
      this._lastY = y
    }
    fn()
  }
  createIsVictory(p1M, p2M) {
    const size = this._size
    const board = this._board
    function isValid(x, y, value) {
      return x >= 0 && x < size && y >= 0 && y < size && value === board[x][y]
    }

    return function (x, y, value) {
      let count = 1
      let p1 = p1M([x, y])
      let p2 = p2M([x, y])
      while (1) {
        let p1IsValid = false
        let p2IsValid = false
        if (isValid(...p1, value)) {
          count++
          p1IsValid = true
          p1 = p1M(p1)
        }
        if (isValid(...p2, value)) {
          count++
          p2IsValid = true
          p2 = p2M(p2)
        }
        if (count >= 5) {
          return true
        }
        if (!p1IsValid && !p2IsValid) {
          return false
        }
      }
    }
  }
  isVictory() {
    const { x, y, value } = this.lastData

    const isH = this.createIsVictory(
      ([x, y]) => [x - 1, y],
      ([x, y]) => [x + 1, y]
    )
    const isV = this.createIsVictory(
      ([x, y]) => [x, y - 1],
      ([x, y]) => [x, y + 1]
    )
    const isD = this.createIsVictory(
      ([x, y]) => [x - 1, y - 1],
      ([x, y]) => [x + 1, y + 1]
    )
    const isD2 = this.createIsVictory(
      ([x, y]) => [x - 1, y + 1],
      ([x, y]) => [x + 1, y - 1]
    )
    return (
      isH(x, y, value) ||
      isV(x, y, value) ||
      isD(x, y, value) ||
      isD2(x, y, value)
    )
  }
}


const gomoku = new Gomoku()
const board = ref(gomoku._board)
const fall = (...args) => gomoku.setPiece(...args, () => {
  board.value = gomoku._board
  if (gomoku.isVictory()) {
    alert('恭喜你，你赢了')
  }
})

function getPos(x, y) {
  fall(x, y, 1)
}











// onMounted(() => {
//   fall(1, 1, 1)
//   fall(1, 2, 1)
//   fall(1, 3, 1)
//   fall(1, 4, 1)
//   fall(1, 5, 2)

//   fall(0, 5, 1)
//   fall(2, 3, 1)
//   fall(3, 2, 1)
//   fall(4, 1, 1)
//   console.log(...gomoku._board)
//   console.log('结果', gomoku.isVictory(), gomoku)
// })
</script>

<template>
  <div class="board">
    <div class="rows" v-for="(row, r) in board" :key="r">
      <div class="columns " v-for="(_, c) in row" :key="c" @click="getPos(c, r)">
        <!-- {{ column }} -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.board {
  position: absolute;
  top: 50px;
  left: 50px;

  .rows {
    display: flex;
    justify-content: space-around;
    width: fit-content;

    .columns {
      --s: 25px;
      width: var(--s);
      height: var(--s);
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      /* &.black { */
        /* background-color: #000; */
        border-radius: 50%;
        /* transform: scale(.5); */
      /* } */

      &::before {
        content: '';
        position: absolute;
        width: 1px;
        height: 100%;
        background-color: #000;
      }

      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        background-color: #000;
      }

      &:hover {
        background-color: #cccccc99;
      }
    }
  }
}
</style>
