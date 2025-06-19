<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import $, { fn } from "jquery";
import { ElMessage } from "element-plus";


class Gomoku {
  constructor(size = 25) {
    this._size = size
    this.init()
  }

  init() {
    this._board = new Array(this._size).fill(0).map(() => new Array(this._size).fill(0))
    this._lastX = 0
    this._lastY = 0
  }

  clear() {
    this.init()
  }

  get lastData() {
    return {
      x: this._lastX,
      y: this._lastY,
      value: this._board[this._lastY][this._lastX]
    }
  }

  isVoid(x, y) {
    return this._board[y][x] !== 0
  }

  setPiece(x, y, value, fn = () => { }) {
    if (x < 0 || x >= this._size || y < 0 || y >= this._size) {
      return
    }
    if (this._board[y][x] === 0) {
      this._board[y][x] = value
      this._lastX = x
      this._lastY = y
      fn()
    }
  }
  createIsVictory(p1M, p2M) {
    const size = this._size
    const board = this._board
    function isValid(x, y, value) {
      return x >= 0 && x < size && y >= 0 && y < size && value === board[y][x]
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
const colorG = ['black', 'white']

let id
const time = ref(0)
const fall = (...args) => gomoku.setPiece(...args, () => {
  if (id) {
    time.value = 0
    clearInterval(id)
  }
  const end = () => {
    alert(`恭喜${colorG[n]}胜利`)
    gomoku.clear()
    board.value = [...gomoku._board]
  }
  if (gomoku.isVictory()) {
    end()
  } else {
    board.value = [...gomoku._board]

    time.value = 60
    id = setInterval(() => {
      time.value--
      if (!time.value) {
        end()
        clearInterval(id)
      }
    }, 1000)
  }
})


let n = 1
function getPos(x, y) {
  if (gomoku.isVoid(x, y)) {
    ElMessage({
      type: 'error',
      message: '请勿重复落子',
      grouping: true
    })
    return;
  }
  n ^= 1
  fall(x, y, n + 1)
}






</script>

<template>
  请{{ colorG[n ^ 1] }}落子<span v-if="time">，你还有{{ time }}秒</span>
  <div class="board">
    <div class="rows" v-for="(row, r) in board" :key="r">
      <div class="columns " v-for="(column, c) in row" :key="c" @click="getPos(c, r)">
        <!-- {{ column }} -->
        <!-- {{ colorG[column - 1] }} -->
        <div class="chessman" :class="colorG[column - 1]"></div>
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
      color: #000;

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

      .chessman {
        width: 50%;
        height: 50%;
        border-radius: 50%;
        z-index: 1;

        &.black {
          background-color: black;
        }

        &.white {
          background-color: white;
          border: 1px solid #ccc;
        }
      }
    }
  }
}
</style>
