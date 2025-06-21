<script setup>
import { onMounted, onUnmounted, ref } from 'vue'



class Tetris {
  constructor(end) {
    this.end = end
    const width = 10, height = 21
    this.boardSize = { width, height }
    this._board = new Array(height).fill(0)
    this._moveBoard = new Array(height).fill(0)
    this.init()
  }

  getRow(row = []) {
    const arr = new Array(this.boardSize.width).fill().map((_, i) => +row.includes(i) && 1)
    return +`0b${arr.join('')}`
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
      const ix = Math.floor((this.boardSize.width - size) / 2)
      const board = new Array(this.boardSize.height).fill(0)

      diamond.matrix.forEach((row, i) => board[i] =
        this.getRow(
          row.map((m, n) => m * (n + ix)).filter(Boolean)
        )
      )

      diamond.size = size
      diamond.position0 = [ix, 0]
      diamond.defaultBoard = board
    })
    this._diamonds = diamonds
  }

  createMoveBoard() {
    const len = this._diamonds.length
    const index = Math.floor(Math.random() * len)
    const color = Math.floor(Math.random() * len) + 1
    const { defaultBoard, ...diamond } = structuredClone(this._diamonds[index])
    this._diamond = { index, color, ...diamond }
    this._moveBoard = defaultBoard
    // this._moveBoard2 = this._moveBoard.map(i => i)
    // this._moveBoard3 = this._moveBoard.map(i => this.shi2er(i))
  }

  shi2er(p) {
    const _to = n => '0b' + (+n).toString(2).padStart(this.boardSize.width, 0)
    if (Array.isArray(p)) {
      return p.map(i => _to(i))
    } else return _to(p)
  }

  isSP(a, b) {
    return (a & b) !== 0
  }

  spin() {
    let { position0: [x0, y0] } = this._diamond
    const { matrix, size } = this._diamond
    const xIsVoid = x0 < 0 || x0 > this.boardSize.width - size
    const yIsVoid = y0 < 0 || y0 > this.boardSize.height - size
    if (xIsVoid) {
      while (1) {
        x0 = this._diamond.position0[0]     // 重新获取 x0
        if (x0 < 0) {
          this.rightMove()
        } else if (x0 > this.boardSize.width - size) {
          this.leftMove()
        } else {
          break
        }
      }
    }
    if (yIsVoid) {
      return;
    }
    const newBoard = new Array(this.boardSize.height).fill(0)
    const newMatrix = structuredClone(matrix)
    for (let j in matrix) {
      for (let i in matrix[j]) {
        i = +i, j = +j
        const v = matrix[j][i]
        newMatrix[i][size - j - 1] = v
        if (v) {
          const x = (size - j - 1) + x0, y = (i) + y0
          const row = this.getRow([x])
          newBoard[y] += row
        }
      }
    }
    this._diamond.matrix = newMatrix
    this._moveBoard = newBoard
  }
  leftMove(reject) {
    const isVoid = this.isSP(Math.max(...this._moveBoard), this.getRow([0]))
    if (isVoid) {
      reject && reject()
      return;
    }
    this._diamond.position0[0]--
    this._moveBoard = this._moveBoard.map(i => i && (i << 1))
  }
  rightMove(reject) {
    const isVoid = this.isSP(Math.max(...this._moveBoard.filter(Boolean)), 1)
    if (isVoid) {
      reject && reject()
      return;
    }
    this._diamond.position0[0]++
    this._moveBoard = this._moveBoard.map(i => i && (i >> 1))
  }
  downMove() {
    const i = this._moveBoard.findLastIndex(Boolean)
    if (i === -1) {
      return;
    }
    const isEnd = (i === this._diamond.size - 1) && this.isSP(this._moveBoard[i], this._board[i + 1])
    if (isEnd) {
      this.end()
      return true;
    }
    const isVoid = (i === this._moveBoard.length - 1) || this.isSP(this._moveBoard[i], this._board[i + 1])
    // console.log('👨‍🦰', isVoid, i, ...this.s_MoveBoard)
    if (isVoid) {
      this.stack()
      return true;
    }
    this._diamond.position0[1]++
    this._moveBoard = [0, ...this._moveBoard.slice(0, -1)]
  }

  eliminate(i) {
    console.log('🦴', 2)
    const board = structuredClone(this._board)
    board.splice(i, 1)
    board.unshift(0)
    this._board = board
  }

  stack() {
    // console.log('stack', this._diamond.index, ...this._diamond.matrix, this._moveBoard, this._board)
    for (const i in this._moveBoard) {
      const row = this._moveBoard[i];
      if (row) {
        this._board[i] += row
        this._moveBoard[i] = 0
      }
    }
    this.clear()
    console.log('🦴', 1)
  }

  clear() {
    this._diamond = {}
    // this._moveBoard.forEach(row => (row = 0))
  }

  str2arr(p) {
    const _to = s => s.slice(2).split('').map(i => +i)
    if (Array.isArray(p)) {
      return p.map(i => _to(i))
    } else return _to(p)
  }

  get s_Board() {
    return this.shi2er(this._board)
  }

  get s_MoveBoard() {
    return this.shi2er(this._moveBoard)
  }


  get renderBoard() {
    return this._board.map((row, i) => this._moveBoard[i] + row)
  }

  get s_RenderBoard() {
    return this.shi2er(this.renderBoard)
  }

  get e_RenderBoard() {
    return this.str2arr(this.s_RenderBoard)
  }
}

function createTimer(fn, time = 250) {
  let isStop = ref(), old = 0
  function loop(now) {
    if (isStop.value) {
      return;
    }
    requestAnimationFrame(loop)
    if (now - old >= time) {
      old = now
      fn()
    }
  }
  return {
    isStop,
    start() {
      isStop.value = false
    },
    loop,
    stop() {
      isStop.value = true
    }
  }
}

const { start, loop, stop, isStop } = createTimer(down, 500)
const tetris = new Tetris(() => {
  console.log('💆', '结束')
  stop()
})
let startTime
const time = ref(0)
function down(hand) {
  if (isStop.value) {
    return;
  }
  const signal = tetris.downMove()
  render(hand)
  if (signal) {
    diamondDown()
  }


  time.value = Math.floor((Date.now() - startTime) / 1000)
  return signal
}
function diamondDown() {
  if (isStop.value) {
    return;
  }
  tetris.createMoveBoard()
  loop()
}



const board = ref(tetris.e_RenderBoard.slice(1))
let renderIsHand = false
function render(hand) {
  // console.log('🤘', renderIsHand, hand)
  if (renderIsHand && !hand) {
    renderIsHand = false
    return;
  }
  renderIsHand = Boolean(hand)
  const _board = tetris._board
  const n = 2 ** tetris.boardSize.width - 1
  if (_board.some(row => row == n)) {
    // console.log('🗣', _board)
    for (const i in _board) {
      if (_board[i] == n) {
        tetris.eliminate(i)
      }
    }
  }



  board.value = tetris.e_RenderBoard.slice(1)
  // console.log('🤔', board.value)
}

const control = {
  ArrowLeft() {
    tetris.leftMove()
    render()
  },
  ArrowRight() {
    tetris.rightMove()
    render()
  },
  ArrowDown() {
    return down(true)
  },
  ArrowUp() {
    tetris.spin()
    render()
  },
  Space() {
    const j = tetris._moveBoard.findLastIndex(Boolean)
    console.log('👩‍👩‍👧‍👦', tetris.boardSize.height, j)
    for (let i = 0; i < tetris.boardSize.height - j - 1; i++) {
      if (this.ArrowDown()) {
        return;
      }
    }
  }
}



onMounted(() => {
  // diamondDown()
  console.log('😓', tetris)



  window.addEventListener('keydown', e => {
    const { code } = e
    e.preventDefault()
    control[code] && control[code]()
  })
})
onUnmounted(stop)
</script>

<template>
  <el-button v-if="isStop === undefined" type="info"
    @click="start(); startTime = Date.now(); diamondDown()">游戏开始</el-button>
  <el-button v-else-if="isStop" type="info" @click="start(); loop()">游戏继续</el-button>
  <el-button v-else type="info" @click="stop()">游戏暂停</el-button>
  游戏进行了{{ time }}秒
  <div class="box">
    <div class="row" v-for="(row, r) in board" :key="r">
      <div class="item" v-for="(item, c) in row" :key="c" :style="{ background: item ? '#555' : '' }">
        <!-- {{ item ? '1' : '' }} -->
      </div>
    </div>
  </div>

  <div class="control">
    <el-button type="info" @click="control.ArrowLeft()">左</el-button>
    <el-button type="info" @click="control.ArrowUp()">转</el-button>
    <el-button type="info" @click="control.ArrowRight()">右</el-button>
    <el-button type="info" @click="control.Space()">落</el-button>
    <el-button type="info" @click="control.ArrowDown()">下</el-button>
  </div>
</template>

<style scoped>
.box {
  display: flex;
  flex-direction: column;

  .row {
    display: flex;

    .item {
      width: 20px;
      height: 20px;
      border: 1px solid black;
    }
  }
}
</style>
